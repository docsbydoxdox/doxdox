import { promises as fs } from 'fs';

import { join } from 'path';

import { File, Method, multiLinePatternMatch, slugify } from 'doxdox-core';

import { parse as commentParse } from 'comment-parser';

import { firstMatch, matches } from 'super-regex';

const REGEX_TIMEOUT = 1000;

const JSDOC_PATTERN = /[ \t]*\/\*\*\s*\n?([^*]*(\*[^/])?)*\*\//g;

const IDENTIFIER_PATTERNS = [
    /^([a-z0-9]+):/i,
    /^(?:static\s+)?([a-z0-9]+)\s*\(/i,
    /^(?:export\s+)?(?:var|let|const)\s+([a-z0-9]+)\s*=/i,
    /^(?:this|exports)\.([a-z0-9]+)\s*=/i,
    /^(?:export\s+)?function\s+([a-z0-9]+)\s*\(/i,
    /^class\s+([a-z0-9]+)\s*{/i,
    /^[a-z0-9]+\s*as\s*([a-z0-9]+)/i
];

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
    content: string
): Promise<File> => {
    const comments = Array.from(
        matches(JSDOC_PATTERN, content, { timeout: REGEX_TIMEOUT })
    ).map(({ match }) => match);

    const methods = comments.map(comment => ({
        rawComment: comment,
        comment: commentParse(comment)[0],
        name: '',
        code: '',
        lines: multiLinePatternMatch(content, comment)
    }));

    for (let i = 0; i < methods.length; i += 1) {
        if (methods[i].lines.matched && i === methods.length - 1) {
            methods[i].code = content
                .split(/\r?\n/)
                .slice(methods[i].lines.end)
                .join('\n')
                .trim();
        } else if (methods[i].lines.matched && methods[i + 1].lines.matched) {
            methods[i].code = content
                .split(/\r?\n/)
                .slice(methods[i].lines.end, methods[i + 1].lines.start)
                .join('\n')
                .trim();
        }
    }

    methods.map(method => {
        if (!method.code) {
            return;
        }

        const [firstLine] = method.code.trim().split(/\r?\n/);

        for (let i = 0; i < IDENTIFIER_PATTERNS.length; i += 1) {
            const results = firstMatch(
                IDENTIFIER_PATTERNS[i],
                firstLine.trim(),
                { timeout: REGEX_TIMEOUT }
            );

            if (results) {
                method.name = results.groups[0];

                break;
            }
        }
    });

    return {
        path,
        methods: methods
            .filter(method => method.name)
            .map(method => {
                const paramTags = method.comment.tags.filter(({ tag }) =>
                    /param$/.test(tag)
                );
                const returnTags = method.comment.tags.filter(({ tag }) =>
                    /return$/.test(tag)
                );
                const privateScopeTags = method.comment.tags.filter(({ tag }) =>
                    /private$/.test(tag)
                );

                const params = paramTags.map(({ name, description, type }) => ({
                    name,
                    description,
                    types: [type.replace(/\?/, '')]
                }));

                const returns = returnTags.map(
                    ({ name, description, type }) => ({
                        name: null,
                        description: `${name} ${description}`,
                        types: [type.replace(/\?/, '')]
                    })
                );
                return {
                    slug: `${slugify(path)}-${slugify(method.name)}`,
                    name: method.name,
                    fullName: `${method.name}(${params
                        .map(param => param.name)
                        .join(', ')})`,
                    description: method.comment.description,
                    params,
                    returns,
                    private: privateScopeTags.length > 0
                };
            })
            .sort((a, b) => {
                if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
                    return -1;
                }
                if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
                    return 1;
                }
                return 0;
            }) as unknown as Method[]
    };
};

export default parser;
