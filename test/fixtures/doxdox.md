# Untitled Project 



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

    parseInputs(['src/main.js'], {'ignore': [], 'parser': 'dox', 'layout': 'markdown'}).then(content => {});




##### Parameters

- **inputs** `Array`   Array of directory globs and/or files.
- **config** `Object`   Configuration object.
- **config.ignore** `String`   Array of paths to ignore.
- **config.parser** `String`   String representing the parser to be used.
- **config.layout** `String`   String representing the layout plugin to be used.




##### Returns


- `Object`   Promise




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
