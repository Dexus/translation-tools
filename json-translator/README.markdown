translate-json
=====


Tool to translate strings in a JSON document.

## Install

    npm i -g @hobbica98/translate-json

## Usage

    Usage:
      translate-json [options] -from <language> -to <language> (- | <input>) [<output>]
      translate-json [options] --from=<language> --to=<language> (- | <input>) [<output>]

    Options:
      -t, --translator              The translation service to use: google (default), yandex, bing.
      -k, --api-key                 The API key to be used with the translation service.
      -p, --preserve-html-entities  Preserve HTML entities in translated text. (False by default.)
      -e, --exclude                 Regular expression to exclude key paths. e.g. '^(notThis|this|not.this.either)$'
      -d, --dry-run                 Do not actually translate any values, prefix strings with 'zz_' to mark them.
      -h, --help                    Show this screen.
      -v, --version                 Show version.
      -ff, --file-format            File formats supported JSON (default), js with export default (only one export per file) for i18n.
      --verbose                     Log more.

    Examples:
      translate-json --from=en --to=ru ./labels.json ./labels-ru.json
      translate-json -d --from=en --to=ru ./labels.json ./labels-ru.json
      translate-json --preserve-html-entities --from=en --to=ru ./labels.json ./labels-ru.json
      cat input.json | translate-json --from en -to ru - > output.json
