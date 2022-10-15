import { promises as fs } from 'fs';

import { join } from 'path';

import { File, Method, multiLinePatternMatch, slugify } from 'doxdox-core';

import { Block, parse as commentParse } from 'comment-parser';

import { firstMatch, matches } from 'super-regex';

const REGEX_TIMEOUT = 1000;

const JSDOC_PATTERN = /(^|[ \t]+)\/\*\*\s*\n?(?:[^*]*(?:\*[^/])?)*\*\//gms;

const IDENTIFIER_PATTERNS = [
    /(?:class|function|var|let|const)[ ]+([a-z0-9_]+)[ ]*(?:[={(])?/i,
    /((?:[a-z0-9_.]+)(\.prototype)?\.(?:[a-z0-9_]+))/i,
    /[a-z0-9_]+[ ]*as[ ]*([a-z0-9_]+)/i,
    /([a-z0-9_]+)[ ]*[(:]/i
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

    const methods: {
        rawComment: string;
        comment: Block;
        name: string;
        code: string;
        lines: {
            start?: number | undefined;
            end?: number | undefined;
            matched: boolean;
        };
    }[] = [];

    for (let i = 0; i < comments.length; i += 1) {
        const previousComment = methods[i - 1];

        const comment = comments[i];

        const linePatternMatchOffset =
            previousComment && previousComment.lines
                ? previousComment.lines.end
                : 0;

        methods.push({
            rawComment: comment,
            comment: commentParse(comment)[0],
            name: '',
            code: '',
            lines: multiLinePatternMatch(
                content,
                comment,
                linePatternMatchOffset
            )
        });
    }

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
                const methodName = method.name.replace(/\.prototype/i, '');

                const paramTags = method.comment.tags.filter(({ tag }) =>
                    /param$/.test(tag)
                );

                const returnTags = method.comment.tags.filter(({ tag }) =>
                    /return$/.test(tag)
                );

                const privateScopeTags = method.comment.tags.filter(
                    ({ tag, name }) =>
                        /private$/.test(tag) ||
                        (tag === 'api' && /private$/.test(name))
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
                    name: methodName,
                    fullName: `${methodName}(${params
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
