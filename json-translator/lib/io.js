const os = require("os");
const path = require("path");
const fs = require("fs").promises;
const { EOL } = require("os");
const { STDIN, STDOUT } = require("./cli_options");
const { format } = require("util");
const { errors } = require("../strings.json");
const getInput = async (source, fileFormat) => {
  let input;
  let json;

  if (source === STDIN) {
    try {
      input = await getInputStdIn();
    } catch (ex) {
      throw new Error(errors.INVALID_STD_INPUT);
    }
  } else {
    try {
      input = await fs.readFile(path.resolve(source), { encoding: "utf8" });
    } catch (ex) {
      throw new Error(format(errors.INVALID_INPUT, source));
    }
  }
  if (fileFormat === "js") {
    let lines = input.split(os.EOL);
    if (lines.length <= 1) lines = input.split("\n");
    lines.splice(
      0,
      lines.findIndex((value) => value === "export default {") + 1
    );
    lines.splice(lines.length - 2, 2);
    let text = "{\r\n";
    lines.forEach((l) => {
      text += l + "\r\n";
    });
    text += "}\r\n";
    var fixedJSON = text

      // Replace ":" with "@colon@" if it's between double-quotes
      .replace(/:\s*"([^"]*)"/g, function (match, p1) {
        return ': "' + p1.replace(/:/g, "@colon@") + '"';
      })

      // Replace ":" with "@colon@" if it's between single-quotes
      .replace(/:\s*'([^']*)'/g, function (match, p1) {
        return ': "' + p1.replace(/:/g, "@colon@") + '"';
      })

      // Add double-quotes around any tokens before the remaining ":"
      .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')

      // Turn "@colon@" back into ":"
      .replace(/@colon@/g, ":");
    json = JSON.parse(fixedJSON);
    console.log(json);
  } else {
    try {
      json = JSON.parse(input);
    } catch (error) {
      const friendlySourceName = source === STDIN ? "Standard Input" : source;
      throw new Error(format(errors.INVALID_JSON_DOC, friendlySourceName));
    }
  }

  return json;
};

const getInputStdIn = () =>
  new Promise((resolve, reject) => {
    const { stdin } = process;

    let buffer = "";

    stdin.on("readable", () => {
      const chunk = stdin.read();
      if (chunk !== null) buffer += chunk;
    });

    stdin.on("error", (error) => reject(error));

    stdin.on("end", () => (buffer ? resolve(buffer) : reject()));
  });

const writeResult = async (result, destination, fileformat) => {
  let prettyPrintedResult = JSON.stringify(result, null, 2).replace(/\n/g, EOL);

  if (typeof prettyPrintedResult !== "string") {
    throw new TypeError(
      "Invalid result will not be written to disk. " + prettyPrintedResult
    );
  }

  if (destination === STDOUT) {
    console.log(prettyPrintedResult);
  } else {
    if (fileformat === "js") {
      prettyPrintedResult = "export default " + prettyPrintedResult;
    }
    await fs.writeFile(destination, prettyPrintedResult, { encoding: "utf8" });
  }
};

module.exports = { getInput, getInputStdIn, writeResult };
