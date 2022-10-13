import parse from './index';

describe('custom parser', () => {
    describe('parse', () => {
        it('parse example jsdoc headers (declaration methods)', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/declaration.js')
            ).resolves.toMatchSnapshot();
        });
        it('parse example jsdoc headers (function methods)', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/function.js')
            ).resolves.toMatchSnapshot();
        });
        it('parse empty file', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/empty.js')
            ).resolves.toMatchSnapshot();
        });
    });

    describe('identifier patterns tests', () => {
        it('prototype methods', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/prototype.js')
            ).resolves.toMatchSnapshot();
        });
    });

    describe('parse example from JSDoc documentation https://jsdoc.app/', () => {
        // JSDoc Example from https://jsdoc.app/
        it('parse amd-module', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/amd-module.js')
            ).resolves.toMatchSnapshot();
        });
        it('parse comment-block', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/comment-block.js')
            ).resolves.toMatchSnapshot();
        });
        it('parse comment-inline', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/comment-inline.js')
            ).resolves.toMatchSnapshot();
        });
        it('parse commonjs-module', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/commonjs-module.js')
            ).resolves.toMatchSnapshot();
        });
        it('parse es2015-classes', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/es2015-classes.js')
            ).resolves.toMatchSnapshot();
        });
        it('parse es2015-module', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/es2015-module.js')
            ).resolves.toMatchSnapshot();
        });
        it('parse ignore', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/ignore.js')
            ).resolves.toMatchSnapshot();
        });
        it('parse no-comment', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/no-comment.js')
            ).resolves.toMatchSnapshot();
        });
        it('parse params', async () => {
            await expect(
                parse(process.cwd(), './test/mocks/params.js')
            ).resolves.toMatchSnapshot();
        });
    });
});
