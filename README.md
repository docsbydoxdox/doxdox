[![](https://david-dm.org/neogeek/doxdox.svg)](https://david-dm.org/neogeek/doxdox/) [![](http://img.shields.io/npm/v/doxdox.svg)](https://www.npmjs.org/package/doxdox)

#doxdox

> HTML and Markdown documentation generator.

A documentation generator that takes output from [dox](https://github.com/visionmedia/dox/) and builds a [Bootstrap](http://getbootstrap.com/) or [Markdown](http://daringfireball.net/projects/markdown/) based documentation file.

##Installation

```bash
$ npm install doxdox -g
```

##Usage

```bash
 Usage: doxdox <path> [options]

 Options:

  -h, --help        Display this help message.
  -v, --version     Display the current installed version.
  -t, --title       Sets title.
  -d, --description Sets description.
  -l, --layout      Template to render the documentation with.
  -p, --package     Sets location of package.json file.
  -o, --output      File to save documentation to. Defaults to stdout.

 Available Layouts:

  - Bootstrap (default)   (http://getbootstrap.com/)
  - Markdown          (http://daringfireball.net/projects/markdown/)
```

##Examples:

- [Facade.js](http://facadejs.com/) - [Documentation](http://docs.facadejs.com/)
- [plastick.js](https://github.com/syntaxtsb/plastick.js) - [Documentation](http://doxdox.org/syntaxtsb/plastick.js)
- [CanvasToVideo](https://github.com/neogeek/CanvasToVideo) - [Documentation](http://doxdox.org/neogeek/CanvasToVideo)
