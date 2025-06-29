# doxdox-renderer-pdf

> PDF renderer for doxdox.

[![NPM version](https://img.shields.io/npm/v/doxdox-renderer-pdf?style=flat-square)](https://www.npmjs.org/package/doxdox-renderer-pdf)
[![NPM downloads per month](https://img.shields.io/npm/dm/doxdox-renderer-pdf?style=flat-square)](https://www.npmjs.org/package/doxdox-renderer-pdf)
[![doxdox documentation](https://img.shields.io/badge/doxdox-documentation-%23E85E95?style=flat-square)](https://doxdox.org)

## Install

```bash
$ npm install doxdox-cli@v4.0.0-preview.25 doxdox-renderer-pdf@v4.0.0-preview.25 --save-dev
```

## Usage

> [!WARNING]
> The `-o`/`--output` flag is required when using this renderer on Windows PowerShell.

```bash
$ doxdox -r pdf > docs.pdf
```

or

```bash
$ doxdox -r pdf -o docs.pdf
```
