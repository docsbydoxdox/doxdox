# doxdox

> JSDoc to Bootstrap and Markdown documentation generator.

[![Build Status](https://travis-ci.org/neogeek/doxdox.svg?branch=master)](https://travis-ci.org/neogeek/doxdox)
[![codecov](https://img.shields.io/codecov/c/github/neogeek/doxdox/master.svg)](https://codecov.io/gh/neogeek/doxdox)
[![Dependency Status](https://david-dm.org/neogeek/doxdox.svg)](https://david-dm.org/neogeek/doxdox)
[![Known Vulnerabilities](https://snyk.io/test/npm/doxdox/badge.svg)](https://snyk.io/test/npm/doxdox)
[![bitHound Overall Score](https://www.bithound.io/github/neogeek/doxdox/badges/score.svg)](https://www.bithound.io/github/neogeek/doxdox)
[![NPM Version](http://img.shields.io/npm/v/doxdox.svg?style=flat)](https://www.npmjs.org/package/doxdox)

## Installation

```bash
$ npm install doxdox -g
```

## Usage

### NPM Run Scripts

For more information on NPM run scripts visit <https://docs.npmjs.com/cli/run-script>.

```bash
$ npm install doxdox --save-dev
```

```json
{
  "devDependencies": {
    "doxdox": "1.0.0"
  },
  "scripts": {
    "docs": "doxdox 'src/**/*.js' --layout markdown --output DOCUMENTATION.md"
  }
}
```

```bash
$ npm run docs
```

### CLI

#### Layouts

_Markdown_

For more information on Markdown visit <http://daringfireball.net/projects/markdown/>.

```
$ doxdox 'src/**/*.js' --layout markdown --output DOCUMENTATION.md
```

_Bootstrap_

Form more information on Bootstrap visit <https://v4-alpha.getbootstrap.com/>.

```
$ doxdox 'src/**/*.js' --layout bootstrap --output docs/index.html
```

_Custom Handlebars Template_

For more information on writing Handlebars templates visit <http://handlebarsjs.com/>.

```
$ doxdox 'src/**/*.js' --layout templates/README.hbs --output README.md
```

#### Ignore

The ignore flag allows you to ignore both directories (with glob syntax) and files. Comma separated value.

```bash
$ doxdox './**/*.js' --ignore './coverage/**/*.js'
```

See <https://github.com/isaacs/minimatch#usage> for more information on how to use globs.

#### Help

```
Usage: doxdox <path> [options]

Options:

 -h, --help             Display this help message.
 -v, --version          Display the current installed version.
 -d, --description      Sets description.
 -i, --ignore           Comma separated list of paths to ignore.
 -l, --layout           Template to render the documentation with.
 -o, --output           File to save documentation to. Defaults to stdout.
 -p, --package          Sets location of package.json file.
 -t, --title            Sets title.

Included Layouts:

 - Markdown (default)    (http://daringfireball.net/projects/markdown/)
 - Bootstrap             (http://getbootstrap.com/)
 - Handlebars            (http://handlebarsjs.com/)
```

### API

```javascript
const doxdox = require('doxdox');

parseInputs(['src/**/*.js'], {
    'parser': 'dox',
    'layout': 'markdown'
}).then(content => {

    process.stdout.write(content);

})
```

See [documentation](DOCUMENTATION.md) for more information on [`parseInputs`](DOCUMENTATION.md#parseinputsinputs-config).

## Packages

### Core Packages

| Package | Version | Dependencies |
| ------- | ------- | ------------ |
| [`doxdox-parser-dox`](https://github.com/neogeek/doxdox-parser-dox) | [![NPM Version](http://img.shields.io/npm/v/doxdox-parser-dox.svg?style=flat)](https://www.npmjs.org/package/doxdox-parser-dox) | [![dependencies Status](https://david-dm.org/neogeek/doxdox-parser-dox/status.svg)](https://david-dm.org/neogeek/doxdox-parser-dox) |
| [`doxdox-plugin-markdown`](https://github.com/neogeek/doxdox-plugin-markdown) | [![NPM Version](http://img.shields.io/npm/v/doxdox-plugin-markdown.svg?style=flat)](https://www.npmjs.org/package/doxdox-plugin-markdown) | [![dependencies Status](https://david-dm.org/neogeek/doxdox-plugin-markdown/status.svg)](https://david-dm.org/neogeek/doxdox-plugin-markdown) |
| [`doxdox-plugin-bootstrap`](https://github.com/neogeek/doxdox-plugin-bootstrap) | [![NPM Version](http://img.shields.io/npm/v/doxdox-plugin-bootstrap.svg?style=flat)](https://www.npmjs.org/package/doxdox-plugin-bootstrap) | [![dependencies Status](https://david-dm.org/neogeek/doxdox-plugin-bootstrap/status.svg)](https://david-dm.org/neogeek/doxdox-plugin-bootstrap) |
| [`doxdox-plugin-handlebars`](https://github.com/neogeek/doxdox-plugin-handlebars) | [![NPM Version](http://img.shields.io/npm/v/doxdox-plugin-handlebars.svg?style=flat)](https://www.npmjs.org/package/doxdox-plugin-handlebars) | [![dependencies Status](https://david-dm.org/neogeek/doxdox-plugin-handlebars/status.svg)](https://david-dm.org/neogeek/doxdox-plugin-handlebars) |

### Other Packages

| Package | Version | Dependencies |
| ------- | ------- | ------------ |
| [`grunt-doxdox`](https://github.com/neogeek/grunt-doxdox) | [![NPM Version](http://img.shields.io/npm/v/grunt-doxdox.svg?style=flat)](https://www.npmjs.org/package/grunt-doxdox) | [![dependencies Status](https://david-dm.org/neogeek/grunt-doxdox/status.svg)](https://david-dm.org/neogeek/grunt-doxdox) |

## License

[MIT](LICENSE)
