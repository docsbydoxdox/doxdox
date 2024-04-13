import { promises as fs } from 'fs';

import { promisify } from 'util';

import { exec } from 'child_process';

const execAsync = promisify(exec);

describe('cli', () => {
    it('get version (short flag)', async () => {
        const pkg = JSON.parse(await fs.readFile('./package.json', 'utf8'));

        const { stdout } = await execAsync(`./dist/src/index.js -v`);

        expect(stdout.trim()).toBe(pkg.version);
    });
    it('get version (long flag)', async () => {
        const pkg = JSON.parse(await fs.readFile('./package.json', 'utf8'));

        const { stdout } = await execAsync(`./dist/src/index.js --version`);

        expect(stdout.trim()).toBe(pkg.version);
    });
    it('get help (short flag)', async () => {
        const { stdout } = await execAsync(`./dist/src/index.js -h`);

        expect(stdout).toContain('Usage: doxdox');
    });
    it('get help (long flag)', async () => {
        const { stdout } = await execAsync(`./dist/src/index.js --help`);

        expect(stdout).toContain('Usage: doxdox');
    });
    it('set name (short flag)', async () => {
        const { stdout } = await execAsync(
            `./dist/src/index.js -n "testing the project name"`
        );

        expect(stdout).toContain('# [testing the project name]');
    });
    it('set name (long flag)', async () => {
        const { stdout } = await execAsync(
            `./dist/src/index.js --name "testing the project name"`
        );

        expect(stdout).toContain('# [testing the project name]');
    });
    it('set description (short flag)', async () => {
        const { stdout } = await execAsync(
            `./dist/src/index.js -d "testing the project description"`
        );

        expect(stdout).toContain('> testing the project description');
    });
    it('set description (long flag)', async () => {
        const { stdout } = await execAsync(
            `./dist/src/index.js --description "testing the project description"`
        );

        expect(stdout).toContain('> testing the project description');
    });
    it('set renderer (short flag)', async () => {
        const { stdout } = await execAsync(`./dist/src/index.js -r bootstrap`);

        expect(stdout).toContain('<html>');
    });
    it('set renderer (long flag)', async () => {
        const { stdout } = await execAsync(
            `./dist/src/index.js --renderer bootstrap`
        );

        expect(stdout).toContain('<html>');
    });
    it('set output (no flag)', async () => {
        const { stdout } = await execAsync(`./dist/src/index.js`);

        expect(stdout).toContain('# [doxdox-cli]');
    });
    it('set output (no directory)', async () => {
        const { stdout } = await execAsync(`./dist/src/index.js -o temp.md`);

        await fs.stat('./temp.md');

        expect(stdout).not.toContain('# [doxdox-cli]');

        expect(await fs.readFile('./temp.md', 'utf8')).toContain(
            '# [doxdox-cli]'
        );

        await fs.unlink('./temp.md');
    });
    it('set output (inside existing directory)', async () => {
        const { stdout } = await execAsync(
            `./dist/src/index.js -o src/temp.md`
        );

        await fs.stat('./src/temp.md');

        expect(stdout).not.toContain('# [doxdox-cli]');

        expect(await fs.readFile('./src/temp.md', 'utf8')).toContain(
            '# [doxdox-cli]'
        );

        await fs.unlink('./src/temp.md');
    });
    it('set output (inside non-existing directory)', async () => {
        const { stdout } = await execAsync(
            `./dist/src/index.js -o temp/temp.md`
        );

        await fs.stat('./temp/temp.md');

        expect(stdout).not.toContain('# [doxdox-cli]');

        expect(await fs.readFile('./temp/temp.md', 'utf8')).toContain(
            '# [doxdox-cli]'
        );

        await fs.unlink('./temp/temp.md');
    });
    it('set output (short flag)', async () => {
        const { stdout } = await execAsync(`./dist/src/index.js -o temp.md`);

        await fs.stat('./temp.md');

        expect(stdout).not.toContain('# [doxdox-cli]');

        expect(await fs.readFile('./temp.md', 'utf8')).toContain(
            '# [doxdox-cli]'
        );

        await fs.unlink('./temp.md');
    });
    it('set output (long flag)', async () => {
        const { stdout } = await execAsync(
            `./dist/src/index.js --output temp.md`
        );

        await fs.stat('./temp.md');

        expect(stdout).not.toContain('# [doxdox-cli]');

        expect(await fs.readFile('./temp.md', 'utf8')).toContain(
            '# [doxdox-cli]'
        );

        await fs.unlink('./temp.md');
    });
    it('set package location (no flag)', async () => {
        const { stdout } = await execAsync(`./dist/src/index.js`);

        expect(stdout).toContain('# [doxdox-cli]');
    });
    it('set package location (short flag)', async () => {
        const { stdout } = await execAsync(
            `./dist/src/index.js -p ../../package.json`
        );

        expect(stdout).toContain('# doxdox-workspace');
    });
    it('set package location (long flag)', async () => {
        const { stdout } = await execAsync(
            `./dist/src/index.js --package ../../package.json`
        );

        expect(stdout).toContain('# doxdox-workspace');
    });
});
