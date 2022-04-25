import { parseString } from './index';

describe('template parser', () => {
    it('parse empty string', async () => {
        await expect(parseString('test.js', '')).resolves.toEqual(
            expect.objectContaining({
                path: 'test.js',
                methods: []
            })
        );
    });
});
