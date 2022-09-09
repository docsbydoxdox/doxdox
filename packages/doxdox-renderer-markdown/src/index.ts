import { markdownTable } from 'markdown-table';

import { Doc, File, Method } from 'doxdox-core';

import { CustomConfig } from './types';

const renderMethod = (method: Method) => `## ${method.fullName}

${method.description}

${
    method.params.length
        ? `### Parameters

${markdownTable([
    ['Name', 'Types', 'Description'],
    ...method.params.map(({ name, types, description }) => [
        name,
        types
            .map(type => type.replace(/</, '&lt;').replace(/>/, '&gt;'))
            .join(', '),
        description || ''
    ])
])}`
        : ''
}

${
    method.returns.length
        ? `### Returns

${method.returns.map(
    param => `${param.types
        .map(type => type.replace(/</, '&lt;').replace(/>/, '&gt;'))
        .join(', ')}
${param.description || ''}`
)}`
        : ''
}

`;

const renderFile = (file: File) =>
    `${file.methods.map(method => renderMethod(method)).join('')}`;

export default async (doc: Doc): Promise<string> => `# ${
    doc.homepage ? `[${doc.name}](${doc.homepage})` : doc.name
}

${doc.description ? `> ${doc.description}` : ''}

${doc.files
    .map(file => renderFile(file))
    .join('')
    .trim()}

Documentation generated with [doxdox](https://github.com/docsbydoxdox/doxdox)
${
    !doc.config ||
    (doc.config as CustomConfig)['hideGeneratedTimestamp'] !== true
        ? `\nGenerated on ${new Date().toDateString()} ${new Date().toTimeString()}\n`
        : ''
}`;
