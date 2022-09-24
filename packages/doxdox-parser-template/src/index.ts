import { promises as fs } from 'fs';

import { join } from 'path';

import { File } from 'doxdox-core';

const parser = async (cwd: string, path: string): Promise<File> => {
    try {
        const content = await fs.readFile(join(cwd, path), 'utf8');

        return await parseString(path, content);
    } catch (err) {
        if (process.env.DEBUG) {
            console.error(err);
        }
    }

    return { path, methods: [] };
};
export const parseString = async (
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    content: string
): Promise<File> => {
    return { path, methods: [] };
};

export default parser;
