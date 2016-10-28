# [doxdox](https://github.com/neogeek/doxdox) *1.1.0*

> JSDoc to Bootstrap and Markdown documentation generator.


### lib/doxdox.js


#### parseInput(input, config) 

Parse an input file with parser.

    parseInput('src/main.js', {'parser': 'dox'}).then(files => {});




##### Parameters

- **input** `String`   File to parse.
- **config** `Object`   Configuration object.
- **config.parser** `String`   String representing the parser to be used.




##### Returns


- `Object`   Promise



#### parseInputs(inputs, config) 

Parse array of directory globs and/or files, and then render the parsed data through the defined layout plugin.

    parseInputs(['src/main.js'], {'parser': 'dox', 'layout': 'markdown'}).then(content => {});




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
    loadPlugin({'layout': 'templates/README.hbs'}).then(plugin => {});




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



#### formatPathsArrayToIgnore(paths) 

Format an array of directories and/or files to be ignored by globby by adding a "!" at the beginning of each path.

    console.log(formatPathsArrayToIgnore(['./src']));




##### Parameters

- **paths** `Array`   Array of directories and/or files.




##### Returns


- `Array`   Modified array of directories and/or files.




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
