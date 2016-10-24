# [doxdox](https://github.com/neogeek/doxdox) *1.0.0*

> JSDoc to Bootstrap and Markdown documentation generator.


### lib/doxdox.js


#### parseInput(input, config) 

Parse an input file with parser.

    parseInput('src/main.js', {'parser': 'dox'}).then();




##### Parameters

- **input** `String`   File to parse.
- **config** `Object`   Configuration object.
- **config.parser** `String`   String representing the parser to be used.




##### Returns


- `Object`   Promise



#### parseInputs(inputs, config) 

Parse array of directory globs and/or inputs, and then render the parsed data through the defined layout plugin.

    console.log(parseInputs(['src/main.js'], {'parser': 'dox', 'layout': 'markdown'}));




##### Parameters

- **inputs** `Array`   Array of directory globs and/or files.
- **config** `Object`   Configuration object.
- **config.parser** `String`   String representing the parser to be used.
- **config.layout** `String`   String representing the layout plugin to be used.




##### Returns


- `Object`   Promise




### lib/loaders.js


#### loadParser(config)  *private method*

Load parser based on user defined choice.

    loadParser({'parser': 'dox'}).then(parser => {});




##### Parameters

- **config** `Object`   Configuration object.
- **config.parser** `String`   String representing the parser to be loaded.




##### Returns


- `Object`   Promise



#### loadPlugin(config)  *private method*

Load layout plugin based on user defined choice.

    loadPlugin({'layout': 'markdown'}).then(plugin => {});
    loadPlugin({'layout': 'templates/README.md'}).then(plugin => {});




##### Parameters

- **config** `Object`   Configuration object.
- **config.layout** `String`   String representing the layout plugin to be loaded.




##### Returns


- `Object`   Promise




### lib/utils.js


#### findPackageFileInPath([input]) 

Finds package.json file from either the directory the script was called from or a supplied path.

    console.log(findPackageFileInPath());
    console.log(findPackageFileInPath('./package.json'));
    console.log(findPackageFileInPath('~/git/github/doxdox/'));




##### Parameters

- **input** `String`  *Optional* Directory or file.




##### Returns


- `String`   Path to package.json file.




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
