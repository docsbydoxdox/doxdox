# doxdox

> HTML, Markdown, Wiki and Dash documentation generator.

## Installation

```bash
$ npm install doxdox -g
```

## Usage

```
$ doxdox 'src/**/*.js' --layout markdown --output DOCUMENTATION.md
```

```
Usage: doxdox <path> [options]

Options:

 -h, --help             Display this help message.
 -v, --version          Display the current installed version.
 -d, --description      Sets description.
 -l, --layout           Template to render the documentation with.
 -o, --output           File to save documentation to. Defaults to stdout.
 -p, --package          Sets location of package.json file.
 -t, --title            Sets title.

Included Layouts:

 - Markdown (default)    (http://daringfireball.net/projects/markdown/)
 - Bootstrap             (http://getbootstrap.com/)
 - Handlebars            (http://handlebarsjs.com/)
```

## Packages

### Core Packages

| Package | Version | Dependencies |
| ------- | ------- | ------------ |
| [`doxdox-parser-dox`](https://github.com/neogeek/doxdox-parser-dox) | [![NPM Version](http://img.shields.io/npm/v/doxdox-parser-dox.svg?style=flat)](https://www.npmjs.org/package/doxdox-parser-dox) | [![dependencies Status](https://david-dm.org/neogeek/doxdox-parser-dox/status.svg)](https://david-dm.org/neogeek/doxdox-parser-dox) |
| [`doxdox-plugin-markdown`](https://github.com/neogeek/doxdox-plugin-markdown) | [![NPM Version](http://img.shields.io/npm/v/doxdox-plugin-markdown.svg?style=flat)](https://www.npmjs.org/package/doxdox-plugin-markdown) | [![dependencies Status](https://david-dm.org/neogeek/doxdox-plugin-markdown/status.svg)](https://david-dm.org/neogeek/doxdox-plugin-markdown) |
| [`doxdox-plugin-bootstrap`](https://github.com/neogeek/doxdox-plugin-bootstrap) | [![NPM Version](http://img.shields.io/npm/v/doxdox-plugin-bootstrap.svg?style=flat)](https://www.npmjs.org/package/doxdox-plugin-bootstrap) | [![dependencies Status](https://david-dm.org/neogeek/doxdox-plugin-bootstrap/status.svg)](https://david-dm.org/neogeek/doxdox-plugin-bootstrap) |
| [`doxdox-plugin-handlebars`](https://github.com/neogeek/doxdox-plugin-handlebars) | [![NPM Version](http://img.shields.io/npm/v/doxdox-plugin-handlebars.svg?style=flat)](https://www.npmjs.org/package/doxdox-plugin-handlebars) | [![dependencies Status](https://david-dm.org/neogeek/doxdox-plugin-handlebars/status.svg)](https://david-dm.org/neogeek/doxdox-plugin-handlebars) |
