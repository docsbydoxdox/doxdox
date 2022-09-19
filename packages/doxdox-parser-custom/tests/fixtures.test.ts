import { readFileSync, writeFileSync } from 'fs';

import { parseString } from '../src/index';

const testFixture = async (filename: string) => {
    const results = await parseString(
        `./tests/fixtures/${filename}.js`,
        readFileSync(`./tests/fixtures/${filename}.js`, 'utf8')
    );

    if (process.env.UPDATE_FIXTURES) {
        writeFileSync(
            `./tests/fixtures/${filename}.json`,
            // eslint-disable-next-line no-magic-numbers
            `${JSON.stringify(results, null, 2)}\n`
        );
    }

    expect(results).toEqual(
        JSON.parse(readFileSync(`./tests/fixtures/${filename}.json`, 'utf8'))
    );
};

describe('custom parser', () => {
    it('amd-module', async () => await testFixture('amd-module'));
    it('comment-block', async () => await testFixture('comment-block'));
    it('comment-inline', async () => await testFixture('comment-inline'));
    it('commonjs-module', async () => await testFixture('commonjs-module'));
    it('es2015-classes', async () => await testFixture('es2015-classes'));
    it('es2015-module', async () => await testFixture('es2015-module'));
    it('ignore', async () => await testFixture('ignore'));
    it('no-comment', async () => await testFixture('no-comment'));
    it('params', async () => await testFixture('params'));
});
