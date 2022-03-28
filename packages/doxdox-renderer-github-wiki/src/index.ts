import { join } from 'path';

import admzip from 'adm-zip';

import { markdownTable } from 'markdown-table';

import { Config, Doc, Method } from 'doxdox-core';

import { CustomConfig } from './types';

const renderMethod = (method: Method, config: Config | undefined) => `## ${
    method.fullName
}

${method.description}

${
    method.params.length
        ? `### Parameters

${markdownTable([
    ['Name', 'Types', 'Description'],
    ...method.params.map(({ name, types, description }) => [
        name,
        types.join(', '),
        description || ''
    ])
])}`
        : ''
}

${
    method.returns.length
        ? `### Returns

${method.returns.map(
    param => `${param.types.join(', ')}
${param.description || ''}`
)}`
        : ''
}

Documentation generated with [doxdox](https://github.com/docsbydoxdox/doxdox)
${
    !config || (config as CustomConfig)['hideGeneratedTimestamp'] !== true
        ? `\nGenerated on ${new Date().toDateString()} ${new Date().toTimeString()}\n`
        : ''
}`;

export default async (doc: Doc): Promise<string | Buffer> => {
    const zip = new admzip();

    await Promise.all(
        doc.files.map(async file =>
            Promise.all(
                file.methods.map(async method =>
                    zip.addFile(
                        join(file.path, `${method.name}.md`),
                        Buffer.from(renderMethod(method, doc.config), 'utf-8')
                    )
                )
            )
        )
    );

    return zip.toBuffer();
};
