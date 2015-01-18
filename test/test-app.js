'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var read = require('fs-readdir-recursive');

describe('lib-java generator', function () {
    var appPath = path.join(__dirname, '../app');
    var targetPath = path.join(os.tmpdir(), './temp-test');

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
});
