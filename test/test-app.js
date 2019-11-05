'use strict';

let path = require('path'),
    assert = require('yeoman-assert'),
    helpers = require('yeoman-test'),
    read = require('fs-readdir-recursive'),
    execFile = require('child_process').execFile,

    appPath = path.join(__dirname, '../app'),
    targetPath = path.join(__dirname, 'temp');

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

function runGradle(targetDir, done) {
    const isWin = /^win/.test(process.platform),
        targetFile = targetDir + '/gradlew' + (isWin ? '.bat' : '');
    execFile(targetFile, ['check'], function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
        if (err instanceof Error)
            throw err;
        done();
    });
}

describe('check simple app generation', function () {
    before(function (done) {
        helpers.run(appPath)
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
                targetJava: '1.6',
                libTags: 'java, sample,  lib',
                bintrayUser: 'john',
                bintrayRepo: 'mvn',
                bintraySignFiles: true,
                mavenCentralSync: true,
                enableQualityChecks: true
            })
            .on('end', done);
    });

    it('creates files on initial generation', function () {
        assert.file(read(appPath + '/templates/gradle-base'));
        assert.file(read(appPath + '/templates/project-base').map(dotfile));
        assert.file(read(appPath + '/templates/project-single'));
        assert.file(read(appPath + '/templates/sources').map(dotfile).map(repackage));
    });

    it('creates valid project', function (done) {
        this.timeout(300000); //5 min should be enough to download everything
        runGradle(targetPath + '/testlib', done);
    });
});

describe('check multi-module app generation', function () {
    before(function (done) {
        helpers.run(appPath)
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
                targetJava: '1.6',
                libTags: 'java, sample,  lib',
                bintrayUser: 'john',
                bintrayRepo: 'mvn',
                bintraySignFiles: true,
                mavenCentralSync: true,
                enableQualityChecks: true
            })
            .on('end', done);
    });

    it('creates files on initial generation', function () {
        assert.file(read(appPath + '/templates/gradle-base'));
        assert.file(read(appPath + '/templates/project-base').map(dotfile));
        assert.file(read(appPath + '/templates/project-multi').map(dotfile));
        assert.file(read(appPath + '/templates/project-multi/bom').map(subdir('foo-bom')));
        assert.file(read(appPath + '/templates/project-multi/module').map(subdir('foo-sample')));
        assert.file(read(appPath + '/templates/sources').map(dotfile).map(repackage).map(subdir('foo-sample')));
    });

    it('creates valid project', function (done) {
        this.timeout(300000); //5 min should be enough to download everything
        runGradle(targetPath + '/testlib', done);
    });
});
