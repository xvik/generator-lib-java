'use strict';

var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    path = require('path'),
    _ = require('lodash'),
    _s = require('underscore.string'),
    Helper = require('./utils'),
    printf = require('sprintf');

/**
 * Generator variables, available for templates:
 */
var questions = [
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
    'enableQualityChecks'  // true if quality checks enabled
];


module.exports = yeoman.generators.Base.extend({

    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
        this.helper = new Helper(this);

        this.option('offline', {desc: 'Disables github user lookup', type: Boolean, defaults: false});
        this.option('ask', {
            desc: 'Force questions even all answers available (during project update)',
            type: Boolean,
            defaults: false
        });
    },

    initializing: {
        initConfig: function () {
            // if all questions answered no need to ask again
            var context = this.context = {
                allAnswered: true,
                updateMode: false
            };

            // read stored configuration to not ask questions second time
            questions.forEach(function (name) {
                this[name] = this.config.get(name);
                if (_.isUndefined(this[name])) {
                    context.allAnswered = false;
                } else {
                    // config exist
                    context.updateMode = true;
                }
            }.bind(this));
        },

        initGenerator: function () {
            this.context.usedGeneratorVersion = this.config.get('usedGeneratorVersion');
            this.context.pkg = require('../package.json');
            if (!this.options.offline) {
                this.context.insight = this.helper.initInsight(this.context.pkg);
            }
        },

        initDateVars: function () {
            // init date variables for templates
            var d = new Date();
            var month = d.getMonth() + 1;
            var monthStr = this.helper.twoDigits(month);

            this.year = d.getFullYear();
            this.date = printf('%s.%s.%s', d.getDate(), monthStr, d.getFullYear());
            this.reverseDate = printf('%s-%s-%s', d.getFullYear(), monthStr, this.helper.twoDigits(d.getDate()));
        },

        readGradleConfig: function () {
            var done = this.async();
            this.context.gradleConfPath = this.helper.homePath('.gradle/gradle.properties');
            this.helper.readProperties(this.context.gradleConfPath, function (res) {
                this.context.gradleConf = res;
                done();
            }.bind(this));
        }
    },

    prompting: {
        greeting: function () {
            this.log(chalk.yellow(this.helper.banner(this.templatePath('banner.txt'))));
            this.log('                                      v.' + chalk.green(this.context.pkg.version));
            this.log();
            if (this.context.updateMode) {
                this.log(printf('Updating library %s, generated with v.%s',
                    chalk.red(this.libName), chalk.green(this.context.usedGeneratorVersion)));
                if (this.context.allAnswered && !this.options.ask) {
                    this.log();
                    this.log('Using stored answers from .yo-rc.json. \n' +
                    'If you need to re-run questions use --ask generator option.');
                }
                this.log();
            }
        },

        askInsight: function () {
            if (this.context.insight && this.context.insight.optOut === undefined) {
                return this.context.insight.askPermission(null, this.async());
            }
        },

        askForGithub: function () {
            var options = this.options;
            if (!options.ask && this.context.allAnswered) {
                return;
            }

            var done = this.async(),
                github = options.offline ? null : this.helper.initGithubApi(),
                githubData = {};
            var prompts = [{
                name: 'githubUser', message: 'GitHub user name', store: this.helper.canUseGlobalStore('githubUser'),
                default: this.helper.defaultValue('githubUser'),
                validate: function (input) {
                    var done = this.async();
                    if (!github) {
                        done(!input ? 'Github user required' : true);
                    } else {
                        github.user.getFrom({
                            user: input
                        }, function (err, res) {
                            if (err) {
                                done(printf('Cannot fetch your github profile %s. Make sure ' +
                                    'you\'ve typed it correctly. (or run with --offline generator option)',
                                    chalk.red(input)));
                            } else {
                                githubData = JSON.parse(JSON.stringify(res));
                                done(true);
                            }
                        });
                    }
                }
            },
                {
                    type: 'input',
                    name: 'authorName',
                    message: 'Author name',
                    default: function () {
                        return githubData.name || this.helper.defaultValue('authorName');
                    }.bind(this),
                    validate: function (input) {
                        return !input ? 'Author name required' : true;
                    }

                },
                {
                    type: 'input',
                    name: 'authorEmail',
                    message: 'Author email',
                    default: function () {
                        return githubData.email || this.helper.defaultValue('authorEmail');
                    }.bind(this),
                    validate: function (input) {
                        return !input ? 'Author email required' : true;
                    }
                }
            ];

            this.prompt(prompts, function (props) {
                questions.forEach(function (name) {
                    if (!_.isUndefined(props[name])) {
                        this[name] = props[name];
                    }
                }.bind(this));
                done();
            }.bind(this));
        },

        askForLibName: function () {
            if (this.context.updateMode) {
                // update must be started from project folder - no need to ask for name
                return;
            }

            var done = this.async();
            var libName = this.helper.folderName(this.appname);

            this.log(printf('Accept default library name %s to generate in current folder, ' +
            'otherwise new folder will be created', chalk.red(libName)));

            var prompts = [{
                name: 'libName', message: 'Library name', default: this.libName || libName,
                filter: this.helper.folderName
            }];

            this.prompt(prompts, function (props) {
                this.libName = props.libName;
                this.appname = this.libName;
                done();
            }.bind(this));
        },

        other: function () {
            if (this.context.allAnswered && !this.options.ask) {
                return;
            }

            var done = this.async(),
                disableOnUpdate = function () {
                    return !this.context.updateMode;
                }.bind(this);

            var prompts = [
                {
                    type: 'input',
                    name: 'libGroup',
                    message: 'Maven artifact group',
                    validate: this.helper.validatePackageFn,
                    store: this.helper.canUseGlobalStore('libGroup'),
                    default: this.helper.defaultValue('libGroup', 'com.mycompany')
                },
                {
                    type: 'input',
                    name: 'libPackage',
                    message: 'Base package',
                    validate: this.helper.validatePackageFn,
                    when: disableOnUpdate,
                    default: function (props) {
                        return this.libPackage || props.libGroup + '.' + this.libName;
                    }.bind(this)
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
                    store: this.helper.canUseGlobalStore('bintrayUser'),
                    default: this.helper.defaultValue('bintrayUser'),
                    validate: function (input) {
                        return !input ? 'Bintray user name required' : true;
                    }
                },
                {
                    type: 'input',
                    name: 'bintrayRepo',
                    message: 'Bintray maven repository name',
                    store: this.helper.canUseGlobalStore('bintrayRepo'),
                    default: this.helper.defaultValue('bintrayRepo'),
                    validate: function (input) {
                        return !input ? 'Bintray repository name required' : true;
                    }
                },
                {
                    type: 'confirm',
                    name: 'bintraySignFiles',
                    message: 'Should bintray sign files on release (bintray must be configured accordingly)?',
                    default: this.bintraySignFiles || true
                },
                {
                    type: 'confirm',
                    name: 'enableQualityChecks',
                    message: 'Enable code quality checks (checkstyle, pmd, findbugs)?',
                    default: this.enableQualityChecks || true
                }
            ];

            this.prompt(prompts, function (props) {
                var that = this;
                questions.forEach(function (name) {
                    if (!_.isUndefined(props[name])) {
                        that[name] = props[name];
                    }
                });
                this.log();
                done();
            }.bind(this));
        }
    },

    configuring: {
        insightReport: function () {
            var insight = this.context.insight;
            if (insight) {
                insight.track(this.context.updateMode ? 'update' : 'create');
                insight.track('targetJava', this.targetJava);
                insight.track('bintraySign', this.bintraySignFiles);
                insight.track('qualityChecks', this.enableQualityChecks);
            }
        },

        enforceFolderName: function () {
            if (this.appname !== _.last(this.destinationRoot().split(path.sep))) {
                this.destinationRoot(this.appname);
            }
            this.config.save();
        },

        updateConfig: function () {
            var that = this;
            questions.forEach(function (name) {
                that.config.set(name, that[name]);
            });
            this.config.set('usedGeneratorVersion', this.context.pkg.version);
            this.libTags = _s.words(this.libTags);
        },

        selectJavaVersion: function () {
            var signature = {
                '1.6': 'org.codehaus.mojo.signature:java16-sun:+@signature',
                '1.7': 'org.codehaus.mojo.signature:java17:+@signature',
                '1.8': '' // switch off animalsniffer for latest java
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
                'settings.gradle',
                'build-deps.gradle',
                'gradle/config/findbugs/exclude.xml'
            ];
            this.gradlewExists = this.helper.exists('gradlew');


            // avoid copying jar file due conflict resolution mistake: https://github.com/yeoman/generator/issues/717
            // (in memory content is wring and so comparison failed). this way jar file avoid any collision checks and gets copied as is each time
            this.helper.copy('gradle-base',
                {glob: '**/*[!.jar]', writeOnceFiles: writeOnceFiles});

            // do resolution manually until issue fixed
            this.helper.bulkChangeCopy(
                'gradle-base/gradle/wrapper/gradle-wrapper.jar',
                'gradle/wrapper/gradle-wrapper.jar'
            );

            this.helper.copyTpl('project-base',
                {writeOnceFiles: writeOnceFiles});
        },

        sources: function () {
            if (!this.helper.exists('src/main')) {
                var packageFolder = this.libPackage.replace(/\./g, '/');
                this.helper.copyTpl('sources', {
                    pathReplace: [
                        {regex: /(^|\/)package(\/|$)/, replace: '$1' + packageFolder + '$2'}]
                });
            } else {
                this.log(chalk.yellow('     skip ') + 'sources generation');
            }
        }
    },

    end: {
        chmod: function () {
            // setting executable flag manually
            if (!this.gradlewExists) {
                this.helper.setExecutable('gradlew');
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
        }
    }
});
