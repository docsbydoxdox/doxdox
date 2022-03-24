> ⚠️ Notice: This repository is undergoing a massive rewrite. Things will be missing, broken, or incomplete as development continues.

![doxdox](cover.png)

[![Tests](https://github.com/docsbydoxdox/doxdox/actions/workflows/test.workflow.yml/badge.svg)](https://github.com/docsbydoxdox/doxdox/actions/workflows/test.workflow.yml)
[![NPM version](https://img.shields.io/npm/v/doxdox?style=flat-square)](https://www.npmjs.org/package/doxdox)
[![NPM downloads per month](https://img.shields.io/npm/dm/doxdox?style=flat-square)](https://www.npmjs.org/package/doxdox)
[![doxdox documentation](https://img.shields.io/badge/doxdox-documentation-%23E85E95?style=flat-square)](https://doxdox.org)
[![Join the chat at https://discord.gg/nNtFsfd](https://img.shields.io/badge/discord-join%20chat-7289DA.svg)](https://discord.gg/nNtFsfd)

> Documentation, simple.

doxdox is a simple to use documentation generator that takes [JSDoc](https://jsdoc.app/) comment blocks and generates different documentation formats; [Markdown](https://daringfireball.net/projects/markdown), [Bootstrap](https://getbootstrap.com/), [GitHub Wiki](https://docs.github.com/en/communities/documenting-your-project-with-wikis/about-wikis), and other custom plugins.

doxdox also features support for extendibility via custom plugins for both parsing and generating documentation.

## Example

### In

```javascript
/**
 * Request content from URL or array of URLs.
 *
 * @example fetch('http://www.google.com/humans.txt').then(content => console.log(content));
 * @example fetch(['http://www.google.com/humans.txt']).then(contents => console.log(content[0]));
 * @param {String|String[]} urls A URL or an array of URL strings.
 * @param {Object} [options] Options object.
 * @param {String} [options.cacheDirectory] Directory to store cache. Default is `temp/cache/`.
 * @param {Object} [options.requestOptions] Custom request options object. Default is `{}`.
 * @param {Number} [options.ttl] TTL (Time to live) in seconds. Default is 1800
 * @return {Promise<String[]>} Contents of request as an array.
 * @public
 */
```

### Out

![](screenshot.jpg)

## Install

### Globally

```bash
$ npm install doxdox-cli@v4.0.0-preview.11 -g
```

### Locally

```bash
$ npm install doxdox@v4.0.0-preview.11 --save-dev
```

## Usage

### CLI

```bash
$ doxdox '**/*.js'
```

#### Custom Meta Information

##### Name

```bash
$ doxdox '**/*.js' --name "doxdox-next"
```

##### Description

```bash
$ doxdox '**/*.js' --description "Preview release of the doxdox package"
```

#### Ignore

Files can be ignored via the command line.

```bash
$ doxdox '**/*.js' --ignore tests/**/*.js
```

```bash
$ doxdox '**/*.js' --ignore **/*.test.js
```

They can also be ignored via a `.doxdoxignore` file. This file is similar in format to `.gitignore` and `.npmignore`.

```
tests/**/*.js
**/*.test.js
```

#### Output

##### File

```bash
$ doxdox '**/*.js' --output docs.md
```

##### Stdout

```bash
$ doxdox '**/*.js' > docs.md
```

#### Renderers

##### Markdown

For more information on Markdown visit <https://daringfireball.net/projects/markdown>.

```bash
$ doxdox '**/*.js' --renderer markdown --output docs.md
```

##### Bootstrap

For more information on Bootstrap visit <https://getbootstrap.com>.

```bash
$ doxdox '**/*.js' --renderer bootstrap --output docs.html
```

#### JSON

```bash
$ doxdox '**/*.js' --renderer json --output docs.json
```

#### Help

```
Usage: doxdox <path> ... [options]

Options:

 -h, --help             Display this help message.
 -v, --version          Display the current installed version.
 -n, --name             Sets name of project.
 -d, --description      Sets description of project.
 -i, --ignore           Comma separated list of paths to ignore.
 -l, --parser           Parser used to parse the source files with. Defaults to jsdoc.
 -r, --renderer         Renderer to generate the documentation with. Defaults to Markdown.
 -o, --output           File to save documentation to. Defaults to stdout.
 -p, --package          Sets location of package.json file.

Included Layouts:

 - Markdown (default)    (https://daringfireball.net/projects/markdown)
 - Bootstrap             (https://getbootstrap.com)
 - JSON
```

### NPM Run Scripts

For more information on NPM run scripts visit <https://docs.npmjs.com/cli/v8/commands/npm-run-script>.

```bash
$ npm install doxdox@v4.0.0-preview.11 --save-dev
```

```json
{
  "devDependencies": {
    "doxdox": "4.0.0-preview.10"
  },
  "scripts": {
    "docs": "doxdox 'lib/**/*.js' --renderer markdown --output DOCUMENTATION.md"
  }
}
```

```bash
$ npm run docs
```

### JavaScript

> Note: To use doxdox in this way you must add `"type": "module"` to your `package.json` file.

```javascript
import doxdox from 'doxdox';

import parser from 'doxdox-parser-jsdoc';

import renderer from 'doxdox-renderer-markdown';

doxdox(
  process.cwd(),
  ['lib/index.js', 'lib/loaders.js', 'lib/utils.js'],
  parser,
  renderer,
  {
    name: 'doxdox-example',
    description: 'Description of doxdox example.'
  }
).then(output => {
  process.stdout.write(output);
});
```

### Next.js

> Note: To use doxdox in this way you must add `"type": "module"` to your `package.json` file.

```typescript
import type { NextPage } from 'next';

import doxdox from 'doxdox';

import parser from 'doxdox-parser-jsdoc';

import renderer from 'doxdox-renderer-bootstrap';

export const getServerSideProps = async () => {
  const docs = await doxdox(
    process.cwd(),
    ['lib/index.js', 'lib/loaders.js', 'lib/utils.js'],
    parser,
    renderer,
    {
      name: 'doxdox-example',
      description: 'Description of doxdox example.'
    }
  );

  return { props: { docs } };
};

const Docs: NextPage<{
  docs: string;
}> = ({ docs }) => {
  return <div dangerouslySetInnerHTML={{ __html: docs }}></div>;
};

export default Docs;
```

### Custom Renderer

> Note: To use doxdox in this way you must add `"type": "module"` to your `package.json` file.

```javascript
export default async doc => JSON.stringify(doc);
```

```bash
doxdox -r renderer.js
```

## Plugins

### Parsers

#### Default Parsers

> The following parsers are bundled with `doxdox`.

| Name                                                   | Description              | Version                                                                                                                                 |
| ------------------------------------------------------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| [doxdox-parser-jsdoc](./packages/doxdox-parser-jsdoc/) | JSDoc parser for doxdox. | [![NPM version](https://img.shields.io/npm/v/doxdox-parser-jsdoc?style=flat-square)](https://www.npmjs.org/package/doxdox-parser-jsdoc) |

A template for creating your own parser [doxdox-parser-template](./packages/doxdox-parser-template/).

#### Optional Parsers

> The following parsers are not bundled with `doxdox` and must be installed separately.

| Name                                               | Description            | Version                                                                                                                             |
| -------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [doxdox-parser-dox](./packages/doxdox-parser-dox/) | dox parser for doxdox. | [![NPM version](https://img.shields.io/npm/v/doxdox-parser-dox?style=flat-square)](https://www.npmjs.org/package/doxdox-parser-dox) |

### Renderers

#### Default Renderers

> The following renderers are bundled with `doxdox`.

| Name                                                               | Description                    | Version                                                                                                                                             |
| ------------------------------------------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [doxdox-renderer-bootstrap](./packages/doxdox-renderer-bootstrap/) | Bootstrap renderer for doxdox. | [![NPM version](https://img.shields.io/npm/v/doxdox-renderer-bootstrap?style=flat-square)](https://www.npmjs.org/package/doxdox-renderer-bootstrap) |
| [doxdox-renderer-json](./packages/doxdox-renderer-json/)           | JSON renderer for doxdox.      | [![NPM version](https://img.shields.io/npm/v/doxdox-renderer-json?style=flat-square)](https://www.npmjs.org/package/doxdox-renderer-json)           |
| [doxdox-renderer-markdown](./packages/doxdox-renderer-markdown/)   | Markdown renderer for doxdox.  | [![NPM version](https://img.shields.io/npm/v/doxdox-renderer-markdown?style=flat-square)](https://www.npmjs.org/package/doxdox-renderer-markdown)   |

A template for creating your own renderer [doxdox-renderer-template](./packages/doxdox-renderer-template/).

#### Optional Renderers

> The following renderers are not bundled with `doxdox` and must be installed separately.

| Name                                                                   | Description                      | Version                                                                                                                                                 |
| ---------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [doxdox-renderer-dash](./packages/doxdox-renderer-dash/)               | Dash renderer for doxdox.        | [![NPM version](https://img.shields.io/npm/v/doxdox-renderer-dash?style=flat-square)](https://www.npmjs.org/package/doxdox-renderer-dash)               |
| [doxdox-renderer-github-wiki](./packages/doxdox-renderer-github-wiki/) | GitHub Wiki renderer for doxdox. | [![NPM version](https://img.shields.io/npm/v/doxdox-renderer-github-wiki?style=flat-square)](https://www.npmjs.org/package/doxdox-renderer-github-wiki) |
| [doxdox-renderer-pdf](./packages/doxdox-renderer-pdf/)                 | PDF renderer for doxdox.         | [![NPM version](https://img.shields.io/npm/v/doxdox-renderer-pdf?style=flat-square)](https://www.npmjs.org/package/doxdox-renderer-pdf)                 |

## Questions

If you have any questions regarding the use of doxdox, please use either [GitHub Discussions](https://github.com/docsbydoxdox/doxdox/discussions/) or [Stack Overflow](https://stackoverflow.com/questions/ask?tags=doxdox). The issue tracker is to be used for bug reports and feature requests only.

## Contributing

Be sure to review the [Contributing Guidelines](./CONTRIBUTING.md) before logging an issue or making a pull request.

## License

[MIT](./LICENSE)
