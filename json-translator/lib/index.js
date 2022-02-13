#!/usr/bin/env node

const os = require("os");
const { red } = require("colors");

const { getOptions, usage } = require("./cli_options");
const { getInput, writeResult } = require("./io");
const { translateDeep } = require("./translate");
const transformers = require("./transformers");
const { messages } = require("../strings.json");

const opts = getOptions();

module.exports = ({ src, text, from, to, subscriptionKey, region }) => {};
(async function main() {
  if (opts.version) {
    console.log(require("../../package.json").version);
    return;
  }
  if (opts.help) {
    console.log(usage.join(os.EOL));
    return;
  }

  const doc = await getInput(opts.source, opts.fileFormat);

  const transform =
    opts.api && !opts.dry ? transformers[opts.api] : transformers.dryRun;

  if (opts.verbose) console.info(messages.TRANSFORMER_CHOICE, opts.api);

  const tr = transform(opts);

  const test = ({ cursor, path }) =>
    typeof cursor === "string" &&
    (opts.exclude ? !new RegExp(opts.exclude, "i").test(path) : true) &&
    (opts.include ? new RegExp(opts.include, "i").test(path) : true);

  const transforms = [
    {
      test,
      transform: tr,
    },
  ];

  const translatedDoc = await translateDeep({
    doc,
    transforms,
    options: opts,
  });
  await writeResult(translatedDoc, opts.destination, opts.fileFormat);
})().catch((err) =>
  console.error(
    [red(opts.verbose ? err.trace : String(err)), os.EOL, ...usage].join(os.EOL)
  )
);
