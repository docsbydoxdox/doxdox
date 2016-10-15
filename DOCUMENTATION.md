# [doxdox](https://github.com/neogeek/doxdox) *1.0.0*

> HTML, Markdown, Wiki and Dash documentation generator.


### utils/cmd.js


#### module.exports.findPackageFileInPath([input]) 

Finds package.json file from either the directory the script was called from or a supplied path.

    console.log(findPackageFileInPath());
    console.log(findPackageFileInPath('./package.json'));
    console.log(findPackageFileInPath('~/git/github/doxdox/'));


##### Parameters

- **input** `String`  *Optional* Directory or file.




##### Returns


- `String`   Path to package.json file.




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
