'use strict';

let path = require('path'),
    helpers = require('yeoman-test'),
    read = require('fs-readdir-recursive'),
    util = require('util'),
    execFile = util.promisify(require('child_process').execFile),
    fs = require('fs-extra'),

    appPath = path.join(__dirname, '../app'),
    targetPath = path.join(__dirname, 'temp');

function remapFiles(dir, target = 'testlib/') {
    // append generated project sub-dir
    return read(dir).map(val => target + val)
}

function dotfile(file) {
    return file.replace(/^_|\/_|\\_/, '/.').replace(/^\//, '')
}

function repackage(file) {
    return file.replace(/(^|\/|\\)package(\/|\\|$)/, '$1com/johnd/testlib$2')
}

function subdir(dir) {
    return function (file) {
        return dir + "/" + file;
    }
}

async function runGradle(targetDir, done) {
    const isWin = /^win/.test(process.platform),
        targetFile = 'gradlew' + (isWin ? '.bat' : '');
    const { stdout, stderr } = await execFile(targetFile, ['check'], {cwd: targetDir});
    console.log(stdout);
    console.log(stderr);
    if (done) {
        done();
    }
}

describe('check simple app generation', () => {
    let result

    before(async () => {
        result = await helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true})
            .withPrompts({
                multiModule: false,
                githubUser: 'johnd',
                authorName: 'John Doe',
                authorEmail: 'johnd@somemail.com',
                libName: 'testlib',
                libGroup: 'com.johnd',
                libPackage: 'com.johnd.testlib',
                libVersion: '0.1.0',
                libDesc: 'Test library',
                enableQualityChecks: true
            });
    });

    it('creates files on initial generation', () => {
        result.assertFile(remapFiles(appPath + '/templates/gradle-base'));
        result.assertFile(remapFiles(appPath + '/templates/project-base').map(dotfile));
        result.assertFile(remapFiles(appPath + '/templates/project-single'));
        result.assertFile(remapFiles(appPath + '/templates/sources').map(dotfile).map(repackage));
    });

    it('creates valid project', async () => {
        fs.copySync(path.join(__dirname, 'sources'), targetPath + '/testlib/src/main/java');
        await runGradle(targetPath + '/testlib');
    }).timeout(300000); //5 min should be enough to download everything
});

describe('check multi-module app generation', () => {
    let result

    before(async () => {
        result = await helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true})
            .withPrompts({
                multiModule: true,
                modulePrefix: 'foo',
                moduleName: 'sample',
                githubUser: 'johnd',
                authorName: 'John Doe',
                authorEmail: 'johnd@somemail.com',
                libName: 'testlib',
                libGroup: 'com.johnd',
                libPackage: 'com.johnd.testlib',
                libVersion: '0.1.0',
                libDesc: 'Test library',
                enableQualityChecks: true
            });
    });

    it('creates files on initial generation', () => {
        result.assertFile(remapFiles(appPath + '/templates/gradle-base'));
        result.assertFile(remapFiles(appPath + '/templates/project-base').map(dotfile));
        result.assertFile(remapFiles(appPath + '/templates/project-multi').map(dotfile));
        result.assertFile(read(appPath + '/templates/project-multi-modules/bom').map(subdir('testlib/foo-bom')));
        result.assertFile(read(appPath + '/templates/project-multi-modules/module').map(subdir('testlib/foo-sample')));
        result.assertFile(read(appPath + '/templates/sources').map(dotfile).map(repackage).map(subdir('testlib/foo-sample')));
    });

    it('creates valid project', async () => {
        fs.copySync(path.join(__dirname, 'sources'), targetPath + '/testlib/foo-sample/src/main/java');
        await runGradle(targetPath + '/testlib');
    }).timeout(300000); //5 min should be enough to download everything
});
