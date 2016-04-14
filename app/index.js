'use strict';

var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    Helper = require('yo-java-helper');

/**
 * Generator variables, available for templates:
 */
const questions = [
    'githubUser',           // github user name
    'authorName',           // author full name
    'authorEmail',          // author email
    'libName',              // library name
    'libGroup',             // maven artifact group
    'libPackage',           // base package
    'libVersion',           // library version
    'libDesc',              // library description
    'targetJava',           // target java version (lowest supported), it's not the jdk we build with
    'libTags',              // tags for bintray package (array)
    'bintrayUser',          // bintray user name
    'bintrayRepo',          // target bintray maven repository name
    'bintraySignFiles',    // true if files signing enabled
    'mavenCentralSync',    // true to sync with maven central (must be false on first release)
    'enableQualityChecks'  // true if quality checks enabled
];

/* extra variables:
 *  - year                   // 2015
 *  - date                   // 02.12.2015
 *  - reverseDate            // 2015-12-02
 */

/*
 Templates syntax:
 - <%= %> html escaped value
 - <%- %> not escaped (raw) value
 - <% %> any logic (script block)
 */

const globals = [
    'githubUser',
    'authorName',
    'authorEmail',
    'libGroup',
    'bintrayUser',
    'bintrayRepo'
];

module.exports = yeoman.generators.Base.extend({

    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        this.helper = new Helper(this, require('../package.json'));

        this.option('offline', {
            desc: 'Disables github user lookup',
            type: Boolean,
            defaults: false
        });
        this.option('ask', {
            desc: 'Force questions even all answers available (during project update)',
            type: Boolean,
            defaults: false
        });
    },

    initializing: {
        init: function () {
            this.helper.initConfig(questions);
            this.helper.initDateVars();
        },

        readGradleConfig: function () {
            var done = this.async();
            this.context.gradleConfPath = this.helper.resolveFileFromUserHome('.gradle/gradle.properties');
            this.helper.readProperties(this.context.gradleConfPath, res => {
                this.context.gradleConf = res;
                done();
            });
        }
    },

    prompting: {
        greeting: function () {
            this.log(chalk.yellow(this.helper.readBanner('banner.txt')));
            this.log(`                                      v.${chalk.green(this.context.pkg.version)}`);
            this.log();
            if (this.context.updateMode) {
                this.log(`Updating library ${chalk.red(this.appname)}, generated with v.${chalk.green(this.context.usedGeneratorVersion)}`);
                if (this.context.allAnswered && !this.options.ask) {
                    this.log();
                    this.log('Using stored answers from .yo-rc.json. \n' +
                        'If you need to re-run questions use --ask generator option.');
                }
                this.log();
            }
        },

        askForGithub: function () {
            var options = this.options;
            if (!options.ask && this.context.allAnswered) {
                return;
            }

            var githubData = {},
                helper = this.helper,
                prompts = [
                    {
                        type: 'input',
                        name: 'githubUser',
                        message: 'GitHub user name',
                        default: this.helper.defaultValue('githubUser'),
                        validate: function(input) {
                            var done = this.async();
                            if (options.offline) {
                                done(!input ? 'Github user required' : true);
                                return;
                            }
                            helper.getGithubData(input, (err, res) => {
                                if (err) {
                                    done(res);
                                } else {
                                    githubData = res;
                                    done(true);
                                }
                            });
                        }
                    },
                    {
                        type: 'input',
                        name: 'authorName',
                        message: 'Author name',
                        default: () => githubData.name || this.helper.defaultValue('authorName'),
                        validate: input => !input ? 'Author name required' : true
                    },
                    {
                        type: 'input',
                        name: 'authorEmail',
                        message: 'Author email',
                        default: () => githubData.email || this.helper.defaultValue('authorEmail'),
                        validate: input => !input ? 'Author email required' : true
                    }
                ];
            this.helper.prompt(prompts, questions);
        },

        askForLibName: function () {
            if (this.context.updateMode) {
                // update must be started from project folder - no need to ask for name
                return;
            }

            this.log(`Accept default library name ${chalk.red(this.appname)} to generate in current folder, otherwise new folder will be created`);

            var prompts = [{
                name: 'libName', message: 'Library name', default: this.libName || this.appname,
                filter: this.helper.folderName
            }];

            this.helper.prompt(prompts, ['libName'], props => this.appname = props.libName);
        },

        other: function () {
            if (this.context.allAnswered && !this.options.ask) {
                return;
            }

            var disableOnUpdate = () => !this.context.updateMode;

            var prompts = [
                {
                    type: 'input',
                    name: 'libGroup',
                    message: 'Maven artifact group',
                    validate: this.helper.validatePackage,
                    default: this.helper.defaultValue('libGroup', 'com.mycompany')
                },
                {
                    type: 'input',
                    name: 'libPackage',
                    message: 'Base package',
                    validate: this.helper.validatePackage,
                    when: disableOnUpdate,
                    default: props => this.libPackage || props.libGroup + '.' + this.libName.replace(/(\s+|-|_)/g, '.')
                },
                {type: 'input', name: 'libDesc', message: 'Description', default: this.libDesc},
                {
                    type: 'input',
                    name: 'libVersion',
                    message: 'Version',
                    default: '0.1.0',
                    when: disableOnUpdate
                },
                {
                    type: 'list',
                    name: 'targetJava',
                    message: 'Target java version (the lowest version you want to be compatible with)',
                    default: this.targetJava || '1.6',
                    choices: [
                        {value: '1.6', name: 'Java 6'},
                        {value: '1.7', name: 'Java 7'},
                        {value: '1.8', name: 'Java 8'}
                    ]
                },
                {
                    type: 'input',
                    name: 'libTags',
                    message: 'Tags for bintray package (comma separated list)',
                    default: this.libTags
                },
                {
                    type: 'input',
                    name: 'bintrayUser',
                    message: 'Bintray user name (used for badge generation only)',
                    default: this.helper.defaultValue('bintrayUser'),
                    validate: input => !input ? 'Bintray user name required' : true
                },
                {
                    type: 'input',
                    name: 'bintrayRepo',
                    message: 'Bintray maven repository name',
                    default: this.helper.defaultValue('bintrayRepo'),
                    validate: input => !input ? 'Bintray repository name required' : true
                },
                {
                    type: 'confirm',
                    name: 'bintraySignFiles',
                    message: 'Should bintray sign files on release (bintray must be configured accordingly)?',
                    default: this.bintraySignFiles || true
                },
                {
                    type: 'confirm',
                    name: 'mavenCentralSync',
                    message: 'Should bintray publish to maven central on release?',
                    default: this.mavenCentralSync || true,
                    when: props => props.bintraySignFiles
                },
                {
                    type: 'confirm',
                    name: 'enableQualityChecks',
                    message: 'Enable code quality checks (checkstyle, pmd, findbugs)?',
                    default: this.enableQualityChecks || true
                }
            ];

            this.helper.prompt(prompts, questions);
        }
    },

    configuring: {

        configure: function () {
            this.helper.selectTargetFolder();
            this.helper.saveConfiguration(questions, globals);

            // synchronization with maven central is impossible on first release, but later
            // it must be set to true (if required)
            // so always set it as false on initial generation
            this.mavenCentralSync = this.context.updateMode && this.mavenCentralSync;
            this.libTags = this.helper.quoteTagsList(this.libTags);
        },

        selectJavaVersion: function () {
            var signature = {
                '1.6': 'org.codehaus.mojo.signature:java16:1.1@signature',
                '1.7': 'org.codehaus.mojo.signature:java17:1.0@signature',
                '1.8': '' // switch off animalsniffer for the latest java
            };
            var travis = {
                '1.6': 'oraclejdk7', // better use oraclejdk, compatibility will be checked with animalsniffer
                '1.7': 'oraclejdk7',
                '1.8': 'oraclejdk8'
            };
            this.animalsnifferSignature = signature[this.targetJava];
            this.travisJdk = travis[this.targetJava];
        }
    },

    writing: {
        base: function () {
            var writeOnceFiles = [
                'gradlew',
                'gradlew.bat',
                '.gitignore',
                '.travis.yml',
                'CHANGELOG.md',
                'README.md',
                'gradle.properties',
                'LICENSE',
                'settings.gradle'
            ];
            this.gradlewExists = this.helper.exists('gradlew');

            this.helper.copy('gradle-base', {writeOnceFiles: writeOnceFiles});

            this.helper.copyTpl('project-base', {writeOnceFiles: writeOnceFiles});
        },

        sources: function () {
            if (!this.helper.exists('src/main')) {
                this.helper.copySources(this.libPackage, 'sources');
            } else {
                this.log(chalk.yellow('     skip ') + 'sources generation');
            }
        }
    },

    end: {
        chmod: function () {
            // setting executable flag manually
            if (!this.gradlewExists) {
                this.helper.setExecutableFlag('gradlew');
            }
        },

        checkGradleConfig: function () {
            var conf = this.context.gradleConf;
            var bintrayCfg = true;
            var sonatypeCfg = this.bintraySignFiles;
            if (conf) {
                bintrayCfg = !conf.bintrayUser;
                sonatypeCfg = sonatypeCfg && !conf.sonatypeUser;
            }
            if (bintrayCfg || (sonatypeCfg)) {
                this.log();
                this.log(chalk.red('IMPORTANT') + ' you need to add the following configurations to global gradle file (required for release): ' +
                    '\n ' + chalk.green(this.context.gradleConfPath));
                if (bintrayCfg) {
                    this.log();
                    this.log(chalk.yellow('bintrayUser') + '=' + this.bintrayUser);
                    this.log(chalk.yellow('bintrayKey') + '=<api key (go to bintray profile page, hit edit and access "api keys" section>');
                }
                if (this.bintraySignFiles) {
                    this.log();
                    this.log('If your gpg certificate requires passphrase you need to configure it (for automatic signing):');
                    this.log(chalk.yellow('gpgPassphrase') + '=<gpgPassphrase>');
                }
                if (sonatypeCfg) {
                    this.log();
                    this.log('If you going to automatically sync with maven central, you need to configure sonatype user:');
                    this.log(chalk.yellow('sonatypeUser') + '=<sonatype user>');
                    this.log(chalk.yellow('sonatypePassword') + '=<sonatype password>');
                }
            }
        },

        mavenCentralNotice: function () {
            if (!this.context.updateMode && this.config.get('mavenCentralSync')) {
                this.log();
                this.log(chalk.red('IMPORTANT') + ' Maven central sync is impossible on first release, so ' +
                    'it was set to false in build.gradle (read doc for more details).');
                this.log('Anyway your answer remembered and will be used on project update.');
            }
        }
    }
});
