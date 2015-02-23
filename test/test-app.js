'use strict';

var path = require('path'),
    assert = require('yeoman-generator').assert,
    helpers = require('yeoman-generator').test,
    read = require('fs-readdir-recursive'),
    execFile = require('child_process').execFile;

describe('lib-java generator', function () {
    var appPath = path.join(__dirname, '../app'),
        targetPath = path.join(__dirname, 'temp');

    function dotfile(file) {
        return file.replace(/^_|\/_|\\_/, '/.').replace(/^\//, '')
    }

    function repackage(file) {
        return file.replace(/(^|\/|\\)package(\/|\\|$)/, '$1com/johnd/testlib$2')
    }

    before(function (done) {
        helpers.run(appPath)
            .inDir(targetPath)
            .withOptions({offline: true})
            .withPrompts({
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
        assert.file(read(appPath + '/templates/sources').map(dotfile).map(repackage));
    });

    it('creates valid project', function (done) {
        this.timeout(300000); //5 min should be enough to download everything
        var isWin = /^win/.test(process.platform),
            targetFile = targetPath + '/testlib/gradlew' + (isWin ? '.bat' : '');
        execFile(targetFile, ['check'], function (err, stdout, stderr) {
            if (err instanceof Error)
                throw err;
            console.log(stdout);
            console.log(stderr);
            done();
        });
    });
});
