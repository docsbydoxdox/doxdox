import parse from './index';

describe('jsdoc parser', () => {
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
