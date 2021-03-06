const { format } = require("util");
const { usage, errors } = require("../strings.json");

const STDOUT = Symbol("stdout");
const STDIN = Symbol("stdin");

const args = require("minimist")(process.argv.slice(2));

const getOptions = (argv = args) => {
  const options = {
    source: argv._ && argv._[0],
    destination: argv._ && argv._[1],
    from: argv.from || argv.from,
    to: argv.to || argv.to,
    api: argv.translator || argv.t || "google",
    apiKey: argv["api-key"] || argv.k,
    exclude: argv.exclude || argv.e,
    fileFormat: argv["file-format"] || argv.ff,
    dry: argv["dry-run"] || argv.d,
    preserveEntities: argv["preserve-html-entities"] || argv.p || false,
    verbose: argv.verbose,
    help: argv.help || argv.h,
    version: argv.version || argv.v,
  };
  if (options.version) {
    return options;
  }
  if (!options.source && !options.destination && !options.version) {
    options.help = true;
    return options;
  }
  if (!options.source) {
    throw new Error(errors.REQUIRED_PARAM_INPUT);
  }

  if (options.source === "-") {
    options.source = STDIN;
  }

  if (!options.destination) {
    options.destination = STDOUT;
  }

  if (!["google", "yandex", "bing"].includes(options.api)) {
    throw new Error(errors.INVALID_TRANSLATOR);
  }

  if (options.api !== "google" && !options.apiKey) {
    throw new Error(format(errors.REQUIRED_PARAM_API_KEY, options.api));
  }

  if (!options.from) {
    throw new Error(errors.REQUIRED_PARAM_FROM);
  }
  if (!options.to) {
    throw new Error(errors.REQUIRED_PARAM_TO);
  }
  if (!options.fileFormat) {
    options.fileFormat = "json";
  }
  if (!["json", "js"].includes(options.fileFormat)) {
    throw new Error(format(errors.INVALID_INPUT_FORMAT, options.fileFormat));
  }

  return options;
};

module.exports = { STDOUT, STDIN, getOptions, usage };
