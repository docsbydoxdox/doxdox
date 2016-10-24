# Untitled Project 



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




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
