import { markdownTable } from 'markdown-table';

import MarkdownIt from 'markdown-it';

import hljs from 'highlight.js';

import { create } from 'html-pdf';

import { Doc, File, Method } from 'doxdox-core';

const md = new MarkdownIt({
    html: true,
    linkify: true,
    highlight: str =>
        `<div class="bg-light p-3">${
            hljs.highlight(str, { language: 'javascript' }).value
        }</div>`
});

const renderMethod = (method: Method) => `<div class="mb-5"><a name="${
    method.slug
}" />

<h2 class="method-name">${method.fullName}</h2>
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
                description
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

<p>${param.description}</p>`
)}`
        : ''
}

</div>
`;

const renderFile = (file: File) =>
    `${file.methods.map(method => renderMethod(method)).join('')}`;

export default async (doc: Doc): Promise<Buffer> => {
    return new Promise(resolve => {
        create(
            `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="initial-scale=1" />
            <title>${doc.name}${
                doc.description ? ` - ${doc.description}` : ''
            }</title>
            <link
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
              crossorigin="anonymous"
            />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github.min.css"
              integrity="sha512-0aPQyyeZrWj9sCA46UlmWgKOP0mUipLQ6OZXu8l4IcAmD2u31EPEy9VcIMvl7SoAaKe8bLXZhYoMaE/in+gcgA=="
              crossorigin="anonymous"
              referrerpolicy="no-referrer"
            />
            <style>
              body {
                zoom: 0.65;
              }

              .pkg-name {
                font-size: 3.5rem;
              }

              .pkg-description {
                font-size: 1.5rem;
                font-weight: 200;
              }

              .method-name {
                position: relative;
              }

              .method-scope {
                font-size: 1.5rem;
                color: #999;
              }
            </style>
          </head>
          <body>
            <div class="bg-dark text-white">
              <div class="container p-5">
                ${
                    doc.homepage
                        ? `<h1 class="pkg-name"><a href="${doc.homepage}">${doc.name}</a></h1>`
                        : `<h1 class="pkg-name">${doc.name}</h1>`
                }

                ${
                    doc.description
                        ? `<p class="pkg-description">${doc.description}</p>`
                        : ''
                }
              </div>
            </div>

            <div class="container p-5">
            ${doc.files
                .filter(file => file.methods.length)
                .map(file => renderFile(file))
                .join('')}
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
        `,
            { format: 'Letter' }
        ).toBuffer((err, buffer: Buffer) => {
            resolve(buffer);
        });
    });
};
