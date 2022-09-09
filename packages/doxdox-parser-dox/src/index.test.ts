import parse from './index';

describe('dox parser', () => {
    it('parse example jsdoc headers (declaration methods)', async () => {
        await expect(
            parse(process.cwd(), './test/mocks/declaration.js')
        ).resolves.toMatchSnapshot();
    });
    it('parse example jsdoc headers (function methods)', async () => {
        await expect(
            parse(process.cwd(), './test/mocks/declaration.js')
        ).resolves.toMatchSnapshot();
    });
    it('parse empty string', async () => {
        await expect(
            parse(process.cwd(), './test/mocks/empty.js')
        ).resolves.toMatchSnapshot();
    });
});
