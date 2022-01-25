import { markdownTable } from 'markdown-table';

import { Doc, File, Method } from 'doxdox-core';

const renderMethod = (method: Method) => `## ${method.fullName}

${method.description}

### Parameters

${markdownTable([
    ['Name', 'Types', 'Description'],
    ...method.params.map(({ name, types, description }) => [
        name,
        types.join(', '),
        description
    ])
])}

### Returns

${method.returns.map(
    param => `${param.types.join(', ')}
${param.description}`
)}

`;

const renderFile = (file: File) =>
    `${file.methods.map(method => renderMethod(method)).join('')}`;

export default async (doc: Doc): Promise<string> => `# ${doc.name}

${doc.description ? `> ${doc.description}` : ''}

${doc.files
    .map(file => renderFile(file))
    .join('')
    .trim()}

Documentation generated with [doxdox](https://github.com/docsbydoxdox/doxdox)

Generated on ${new Date().toDateString()} ${new Date().toTimeString()}
`;
