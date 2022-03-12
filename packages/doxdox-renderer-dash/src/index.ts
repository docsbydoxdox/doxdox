import { join } from 'path';

import admzip from 'adm-zip';

import sqlite3 from 'better-sqlite3';

import temp from 'temp';

import { markdownTable } from 'markdown-table';

import MarkdownIt from 'markdown-it';

import hljs from 'highlight.js';

import { getRootDirPath, slugify } from 'doxdox-core';

import { Doc, Method } from 'doxdox-core';

const md = new MarkdownIt({
    html: true,
    linkify: true,
    highlight: str =>
        `<div class="bg-light p-3">${
            hljs.highlight(str, { language: 'javascript' }).value
        }</div>`
});

const renderMethod = (doc: Doc, method: Method) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="initial-scale=1">
<title>${doc.name}${doc.description ? ` - ${doc.description}` : ''}</title>
<link rel="stylesheet" href="resources/bootstrap.min.css">
<link rel="stylesheet" href="resources/github.min.css">
<style>
.method-scope {
  font-size: 1.5rem;
  color: #999;
}
</style>
</head>

<body>

<div class="p-5">

<h2 class="method-name">
  ${method.fullName}
</h2>
${method.private ? `<p class="method-scope">private method</p>` : ''}

${method.description ? md.render(method.description) : ''}

${
    method.params.length
        ? `<h3>Parameters</h3>

<div class="table-responsive">
${md
    .render(
        markdownTable([
            ['Name', 'Types', 'Description'],
            ...method.params.map(({ name, types, description }) => [
                name,
                `<code>${types.join('</code>, <code>')}</code>`,
                description || ''
            ])
        ])
    )
    .replace('<table>', '<table class="table">')}
</div>`
        : ''
}

${
    method.returns.length
        ? `<h3>Returns</h3>

${method.returns.map(
    param => `<p><code>${param.types.join('</code>, <code>')}</code></p>

${param.description ? `<p>${param.description}</p>` : ''}`
)}`
        : ''
}

</div>

<footer>
<div class="container p-5 text-center text-muted">
  <p>
    Documentation generated with
    <a href="https://github.com/docsbydoxdox/doxdox">doxdox</a>.
  </p>
  <p>
    Generated on
    ${new Date().toDateString()} ${new Date().toTimeString()}
  </p>
</div>
</footer>

</body>
</html>
`;

export default async (doc: Doc): Promise<string | Buffer> => {
    temp.track();

    const zip = new admzip();
    const tempdb = temp.openSync('temp.sqlite');
    const db = new sqlite3(tempdb.path);

    zip.addFile(
        `${doc.name}.docset/Contents/Info.plist`,
        Buffer.from(
            `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleIdentifier</key>
    <string>${doc.name ? slugify(doc.name) : ''}</string>
	<key>CFBundleName</key>
    <string>${doc.name}</string>
	<key>DocSetPlatformFamily</key>
    <string>${doc.name ? slugify(doc.name) : ''}</string>
	<key>isDashDocset</key>
	<true/>
</dict>
</plist>`,
            'utf8'
        )
    );

    zip.addLocalFile(
        join(getRootDirPath(import.meta.url), './resources/bootstrap.min.css'),
        `${doc.name}.docset/Contents/Resources/Documents/resources/`
    );

    zip.addLocalFile(
        join(getRootDirPath(import.meta.url), './resources/github.min.css'),
        `${doc.name}.docset/Contents/Resources/Documents/resources/`
    );

    db.exec(
        'CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)'
    );
    db.exec('CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path)');

    doc.files.forEach(file => {
        file.methods.forEach(method => {
            zip.addFile(
                `${doc.name}.docset/Contents/Resources/Documents/${method.slug}.html`,
                Buffer.from(renderMethod(doc, method), 'utf8')
            );

            db.prepare(
                'INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES (@name, @type, @path)'
            ).run({
                name: method.name,
                path: `${method.slug}.html`,
                type: 'Function'
            });

            if (method.params) {
                method.params.forEach(param => {
                    db.prepare(
                        'INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES (@name, @type, @path)'
                    ).run({
                        name: `${method.name}.${param.name}`,
                        path: `${method.slug}.html#//apple_ref/cpp/Property/${method.name}`,
                        type: 'Property'
                    });
                });
            }
        });
    });

    const buffer = db.serialize();

    db.close();

    zip.addFile(`${doc.name}.docset/Contents/Resources/docSet.dsidx`, buffer);

    await temp.cleanup();

    return zip.toBuffer();
};
