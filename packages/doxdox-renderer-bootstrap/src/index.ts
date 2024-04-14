import { markdownTable } from 'markdown-table';

import MarkdownIt from 'markdown-it';

import hljs from 'highlight.js';

import { Doc, File, Method } from 'doxdox-core';

import { CustomConfig } from './types';

const md = new MarkdownIt({
    html: true,
    linkify: true,
    highlight: str =>
        `<div class="bg-light p-3">${
            hljs.highlight(str, { language: 'javascript' }).value
        }</div>`
});

const mdTypes = new MarkdownIt();

const renderMethod = (method: Method) => `<div class="mb-5" data-method-name="${
    method.name
}"><a name="${method.slug}" />

<h2 class="method-name">
  <a href="#${
      method.slug
  }" class="method-permalink" aria-label="Permalink">#</a>
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
        markdownTable(
            [
                ['Name', 'Types', 'Description'],
                ...method.params.map(({ name, types, description }) => [
                    name,
                    `<code>${types
                        .map(type =>
                            type.replace(/</, '&lt;').replace(/>/, '&gt;')
                        )
                        .map(type => mdTypes.renderInline(type))
                        .join('</code>, <code>')}</code>`,
                    description || ''
                ])
            ],
            {}
        )
    )
    .replace('<table>', '<table class="table">')}
</div>`
        : ''
}

${
    method.returns.length
        ? `<h3>Returns</h3>

${method.returns.map(
    param => `<p><code>${param.types
        .map(type => type.replace(/</, '&lt;').replace(/>/, '&gt;'))
        .map(type => mdTypes.renderInline(type))
        .join('</code>, <code>')}</code></p>

${param.description ? `<p>${param.description}</p>` : ''}`
)}`
        : ''
}

</div>
`;

const renderFileNav = (file: File) => `<p><a href="#${
    file.path
}" class="file-name"><b>${file.path}</b></a></p>
<ul class="list-unstyled ml-0">
${file.methods
    .map(
        method =>
            `<li class="method-name" data-method-name="${
                method.name
            }"><a href="#${method.slug}" class="${
                method.private ? 'text-muted' : ''
            }">${method.name}</a></li>`
    )
    .join('')}
</ul>`;

const renderFile = (file: File) =>
    `<a name="${file.path}" />
${file.methods.map(method => renderMethod(method)).join('')}`;

export default async (doc: Doc): Promise<string> => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1" />
    <title>${doc.name}${doc.description ? ` - ${doc.description}` : ''}</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.css"
      rel="stylesheet"
    />
    <style>
      .pkg-name {
        font-size: 3.5rem;
      }

      .pkg-name a {
        text-decoration: none;
      }

      .pkg-description {
        font-size: 1.5rem;
        font-weight: 200;
      }

      nav .file-name {
        color: #E54D89;
      }

      nav .method-name {
        margin: 0.25rem 0;
      }

      main .method-name {
        position: relative;
      }

      main .method-scope {
        font-size: 1.5rem;
        color: #999;
      }

      main .method-permalink {
        position: absolute;
        margin-left: -1em;
        font-weight: normal;
        color: #eee;
        text-decoration: none;
      }

      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <div class="bg-dark text-white">
      <div class="container p-5">
        ${
            doc.homepage
                ? `<h1 class="pkg-name"><a href="${doc.homepage}" class="text-white">${doc.name}</a></h1>`
                : `<h1 class="pkg-name">${doc.name}</h1>`
        }

        ${
            doc.description
                ? `<p class="pkg-description">${doc.description}</p>`
                : ''
        }
      </div>
    </div>

    <div class="container">
      <div class="row">
        <nav class="p-5 col-md-3">
          <form>
            <div class="form-group mb-3">
              <input type="search" class="form-control" id="filter-methods" name="q" placeholder="Filter methods..."
              autocomplete="off">
            </div>
          </form>

          ${doc.files
              .filter(file => file.methods.length)
              .map(file => renderFileNav(file))
              .join('')}
        </nav>

        <main class="p-5 col-md-9">
          ${doc.files
              .filter(file => file.methods.length)
              .map(file => renderFile(file))
              .join('')}
        </main>
      </div>
    </div>

    <footer>
      <div class="container p-5 text-center text-muted">
        <p>
          Documentation generated with
          <a href="https://github.com/docsbydoxdox/doxdox">doxdox</a>.
        </p>
        ${
            !doc.config ||
            (doc.config as CustomConfig)['hideGeneratedTimestamp'] !== true
                ? `<p>
          Generated on
          ${new Date().toDateString()} ${new Date().toTimeString()}
        </p>`
                : ''
        }
      </div>
    </footer>
    <script>
    const params = new URLSearchParams(window.location.search);

    const q = params.get('q') || '';

    const filterInput = document.querySelector('#filter-methods');

    const methods = Array.from(document.querySelectorAll('[data-method-name]'));

    const filterMethods = keyword => {
        const keywordsPattern = RegExp(keyword.trim().split(/[^A-Za-z]+/).join('|'), 'i')

        const matched = methods.filter(method => method.dataset.methodName.match(keywordsPattern));
        const notMatched = methods.filter(method => !method.dataset.methodName.match(keywordsPattern));

        matched.map(match => match.classList.remove('hidden'));
        notMatched.map(match => match.classList.add('hidden'));
    }

    filterInput.addEventListener('keyup', e => filterMethods(e.target.value));
    filterInput.addEventListener('search', e => filterMethods(e.target.value));

    filterInput.value = q;

    filterMethods(q);
    </script>
  </body>
</html>
`;
