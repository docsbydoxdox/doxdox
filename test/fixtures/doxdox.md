# Untitled Project 



### lib/doxdox.js


#### parseFile(input, config) 

Parse a file with custom parser.

    parseFile('src/main.js', {'parser': 'dox'}).then(files => {});




##### Parameters

- **input** `String`   File to parse.
- **config** `Object`   Configuration object.
- **config.parser** `String`   String representing the parser to be used.




##### Returns


- `Object`   Promise



#### parseFiles(inputs, config) 

Parse array of files, and then render the parsed data through the defined layout plugin.

    parseFiles(['src/main.js'], {'ignore': [], 'parser': 'dox', 'layout': 'markdown'}).then(content => {});




##### Parameters

- **inputs** `Array`   Array of directory globs and/or files.
- **config** `Object`   Configuration object.
- **config.ignore** `String`   Array of paths to ignore.
- **config.parser** `String`   String representing the parser to be used.
- **config.layout** `String`   String representing the layout plugin to be used.




##### Returns


- `Object`   Promise



#### parseInputs(inputs, config) 

Parse array of directory globs and/or files, and then render the parsed data through the defined layout plugin.

    parseInputs(['src/*.js'], {'ignore': [], 'parser': 'dox', 'layout': 'markdown'}).then(content => {});




##### Parameters

- **inputs** `Array`   Array of directory globs and/or files.
- **config** `Object`   Configuration object.
- **config.ignore** `String`   Array of paths to ignore.
- **config.parser** `String`   String representing the parser to be used.
- **config.layout** `String`   String representing the layout plugin to be used.




##### Returns


- `Object`   Promise




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
