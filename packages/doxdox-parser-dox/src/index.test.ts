import { parseString } from './index';

describe('dox parser', () => {
    it('parse example jsdoc headers', async () => {
        await expect(
            parseString(
                'lib/utils/index.js',
                `/**
 * Finds file in path.
 *
 *     console.log(await findFileInPath('./', 'package.json'));
 *     console.log(await findFileInPath('../', 'package.json'));
 *     console.log(await findFileInPath('~/git/github/doxdox/', '.package.json'));
 *
 * @param {string} [input] Directory to check for file.
 * @param {string?} [fileName = 'package.json'] File name to check for.
 * @return {Promise<string | null>} Path to package.json file.
 * @public
 */

const findFileInPath = async (input, fileName = 'package.json') => {};

/**
 * Get the root directory of the package, supplied path or URL.
 *
 * @param {string?} [url] Optional path or URL.
 * @return {string} Directory path.
 * @public
 */

const getRootDirPath = (url) => {};`
            )
        ).resolves.toEqual(
            expect.objectContaining({
                path: 'lib/utils/index.js',
                methods: expect.arrayContaining([
                    expect.objectContaining({
                        type: 'declaration',
                        fullName: 'findFileInPath(input, fileName)',
                        name: 'findFileInPath',
                        params: expect.arrayContaining([
                            expect.objectContaining({
                                name: 'input',
                                types: ['string']
                            }),
                            expect.objectContaining({
                                name: 'fileName',
                                types: ['string']
                            })
                        ]),
                        private: false,
                        returns: expect.arrayContaining([
                            expect.objectContaining({
                                name: null,
                                description: 'Path to package.json file.',
                                types: ['Promise.<string|null>']
                            })
                        ]),
                        slug: 'lib-utils-index-js-findfileinpath'
                    }),
                    expect.objectContaining({
                        type: 'declaration',
                        fullName: 'getRootDirPath(url)',
                        name: 'getRootDirPath',
                        params: expect.arrayContaining([
                            expect.objectContaining({
                                name: 'url',
                                types: ['string']
                            })
                        ]),
                        private: false,
                        returns: expect.arrayContaining([
                            expect.objectContaining({
                                name: null,
                                description: 'Directory path.',
                                types: ['string']
                            })
                        ]),
                        slug: 'lib-utils-index-js-getrootdirpath'
                    })
                ])
            })
        );
    });
    it('parse empty string', async () => {
        await expect(parseString('test.js', '')).resolves.toEqual(
            expect.objectContaining({
                path: 'test.js',
                methods: []
            })
        );
    });
});
