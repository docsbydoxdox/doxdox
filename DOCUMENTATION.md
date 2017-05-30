# [doxdox](https://github.com/neogeek/doxdox) *2.0.3*

> JSDoc to Markdown, Bootstrap, and custom Handlebars template documentation generator.


### lib/doxdox.js


#### parseFile(input, config) 

Parse a file with custom parser.

    parseFile('src/main.js', {'parser': 'dox'}).then(files => {});




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| input | `String`  | File to parse. | &nbsp; |
| config | `Object`  | Configuration object. | &nbsp; |
| config.parser | `String`  | String representing the parser to be used. | &nbsp; |




##### Returns


- `Object`  Promise



#### parseFiles(inputs, config) 

Parse array of files, and then render the parsed data through the defined layout plugin.

    parseFiles(['src/main.js'], {'ignore': [], 'parser': 'dox', 'layout': 'markdown'}).then(content => {});




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| inputs | `Array`  | Array of directory globs and/or files. | &nbsp; |
| config | `Object`  | Configuration object. | &nbsp; |
| config.ignore | `String`  | Array of paths to ignore. | &nbsp; |
| config.parser | `String`  | String representing the parser to be used. | &nbsp; |
| config.layout | `String`  | String representing the layout plugin to be used. | &nbsp; |




##### Returns


- `Object`  Promise



#### parseInputs(inputs, config) 

Parse array of directory globs and/or files, and then render the parsed data through the defined layout plugin.

    parseInputs(['src/*.js'], {'ignore': [], 'parser': 'dox', 'layout': 'markdown'}).then(content => {});




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| inputs | `Array`  | Array of directory globs and/or files. | &nbsp; |
| config | `Object`  | Configuration object. | &nbsp; |
| config.ignore | `String`  | Array of paths to ignore. | &nbsp; |
| config.parser | `String`  | String representing the parser to be used. | &nbsp; |
| config.layout | `String`  | String representing the layout plugin to be used. | &nbsp; |




##### Returns


- `Object`  Promise




### lib/loaders.js


#### findPackagePath(pkg)  *private method*

Find which node_modules directory to load package from.

    findPackagePath('doxdox-parser-dox').then(parser => {});
    findPackagePath('doxdox-plugin-bootstrap').then(plugin => {});




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| pkg | `String`  | Package name as string. | &nbsp; |




##### Returns


- `Object`  Promise



#### loadParser(config)  *private method*

Load parser based on user defined choice.

    loadParser({'parser': 'dox'}).then(parser => {});
    loadParser({'parser': 'parser.js'}).then(parser => {});




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| config | `Object`  | Configuration object. | &nbsp; |
| config.parser | `String`  | String representing the parser to be loaded. | &nbsp; |




##### Returns


- `Object`  Promise



#### loadPlugin(config)  *private method*

Load layout plugin based on user defined choice.

    loadPlugin({'layout': 'markdown'}).then(plugin => {});
    loadPlugin({'layout': 'templates/README.hbs'}).then(plugin => {});
    loadPlugin({'layout': 'plugin.js'}).then(plugin => {});




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| config | `Object`  | Configuration object. | &nbsp; |
| config.layout | `String`  | String representing the layout plugin to be loaded. | &nbsp; |




##### Returns


- `Object`  Promise




### lib/utils.js


#### findPackageFileInPath([input]) 

Finds package.json file from either the directory the script was called from or a supplied path.

    console.log(findPackageFileInPath());
    console.log(findPackageFileInPath('./package.json'));
    console.log(findPackageFileInPath('~/git/github/doxdox/'));




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| input | `String`  | Directory or file. | *Optional* |




##### Returns


- `String`  Path to package.json file.



#### formatPathsArrayToIgnore(paths) 

Format an array of directories and/or files to be ignored by globby by adding a "!" at the beginning of each path.

    console.log(formatPathsArrayToIgnore(['./src']));




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| paths | `Array`  | Array of directories and/or files. | &nbsp; |




##### Returns


- `Array`  Modified array of directories and/or files.



#### setConfigDefaults(config) 

Sets default configuration values.

    console.log(setConfigDefaults({}));




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| config | `Object`  | Custom configuration object. | &nbsp; |




##### Returns


- `Object`  Modified configuration object.




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
