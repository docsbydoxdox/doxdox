[![](https://api.travis-ci.org/neogeek/doxdox.svg)](https://travis-ci.org/neogeek/doxdox)
[![](https://david-dm.org/neogeek/doxdox.svg?style=flat)](https://david-dm.org/neogeek/doxdox)
[![bitHound Score](https://www.bithound.io/github/neogeek/doxdox/badges/score.svg)](https://www.bithound.io/github/neogeek/doxdox)
[![](http://img.shields.io/npm/v/doxdox.svg?style=flat)](https://www.npmjs.org/package/doxdox)

# doxdox

> HTML, Markdown and Dash documentation generator.

A documentation generator that takes output from [dox](https://github.com/tj/dox/) and builds either a [Bootstrap](http://getbootstrap.com/), [Markdown](http://daringfireball.net/projects/markdown/) or [Dash](http://kapeli.com/dash) based documentation file.

## Installation

```bash
$ npm install doxdox -g
```

## Usage

```
 Usage: doxdox <path> [options]

 Options:

  -h, --help			Display this help message.
  -v, --version			Display the current installed version.
  -t, --title			Sets title.
  -d, --description		Sets description.
  -l, --layout			Template to render the documentation with.
  -p, --package			Sets location of package.json file.
  -o, --output			File to save documentation to. Defaults to stdout.

 Available Layouts:

  - Bootstrap (default)		(http://getbootstrap.com/)
  - Markdown				(http://daringfireball.net/projects/markdown/)
  - Dash					(http://kapeli.com/docsets/)
  - Wiki					(https://help.github.com/articles/about-github-wikis/)
```

## Examples:

- [Facade.js](http://facadejs.com/) - [Documentation](http://doxdox.org/facadejs/Facade.js)
- [plastick.js](https://github.com/syntaxtsb/plastick.js) - [Documentation](http://doxdox.org/syntaxtsb/plastick.js)
- [CanvasToVideo](https://github.com/neogeek/CanvasToVideo) - [Documentation](http://doxdox.org/neogeek/CanvasToVideo)
