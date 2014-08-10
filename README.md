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
 Usage: doxdox <file> [options]

 Options:

 -h, --help     Display this help message.
 -v, --version      Display the current installed version.
 -t, --title        Sets title.
 -d, --description  Sets description.
 -l, --layout       Template to render the documentation with.
 -o, --output       File to save documentation to. Default to stdout.

 Available Layouts:

 - Bootstrap (default)      (http://getbootstrap.com/)
 - Markdown         (http://daringfireball.net/projects/markdown/)
```

Examples:

- [Facade.js Documentation](http://docs.facadejs.com/)
