'use strict';

const chalk = require('chalk'),
    JavaGenerator = require('yo-java-helper');

/**
 * Generator variables, available for templates:
 */
const questions = [
    'multiModule',          // multi module project
    'modulePrefix',         // multi-module project's modules prefix
    'moduleName',           // multi-module project's module name
    'githubUser',           // github user name
    'authorName',           // author full name
    'authorEmail',          // author email
    'libName',              // library name
    'libGroup',             // maven artifact group
    'libPackage',           // base package
    'libVersion',           // library version
    'libDesc',              // library description
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
    'libGroup'
];

module.exports = class extends JavaGenerator {

    constructor(args, opts) {
        super(args, opts, require('../package.json'));

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
    }

    initializing() {

        // init
        this.$initConfig(questions);
        this.$initDateVars();


        // read gradle config
        const done = this.async();
        this.context.gradleConfPath = this.$resolveFileFromUserHome('.gradle/gradle.properties');
        this.$readProperties(this.context.gradleConfPath, res => {
            this.context.gradleConf = res;
            done();
        });
    }


    prompting() {
        // greeting
        this.log(chalk.yellow(this.$readBanner('banner.txt')));
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

        // ask for github
        const options = this.options;
        if (!options.ask && this.context.allAnswered) {
            return;
        }

        let githubData = {},
            gen = this,
            prompts = [
                {
                    type: 'confirm',
                    name: 'multiModule',
                    message: 'Create multi-module project?',
                    default: this.$defaultValue('multiModule', false)
                },
                {
                    type: 'input',
                    name: 'modulePrefix',
                    message: 'Modules prefix ({prefix}-name)',
                    default: this.$defaultValue('modulePrefix', 'project'),
                    when: props => props.multiModule,
                    validate: input => !input ? 'Prefix required' : true
                },
                {
                    type: 'input',
                    name: 'moduleName',
                    message: 'Module name (prefix-{name})',
                    default: this.$defaultValue('moduleName', 'module'),
                    when: props => props.multiModule,
                    validate: input => !input ? 'Module name required' : true
                },
                {
                    type: 'input',
                    name: 'githubUser',
                    message: 'GitHub user name',
                    default: this.$defaultValue('githubUser'),
                    validate: function (input) {
                        return new Promise((resolve) => {
                            if (options.offline) {
                                if (input) {
                                    resolve(true);
                                } else {
                                    resolve('Github user required');
                                }
                                return;
                            }
                            gen.$getGithubData(input, (err, res) => {
                                if (err) {
                                    resolve(err);
                                } else {
                                    githubData = res;
                                    resolve(true);
                                }
                            });
                        });
                    }
                },
                {
                    type: 'input',
                    name: 'authorName',
                    message: 'Author name',
                    default: () => githubData.name || this.$defaultValue('authorName'),
                    validate: input => !input ? 'Author name required' : true
                },
                {
                    type: 'input',
                    name: 'authorEmail',
                    message: 'Author email',
                    default: () => githubData.email || this.$defaultValue('authorEmail'),
                    validate: input => !input ? 'Author email required' : true
                }
            ];

        let other = () => {
            if (this.context.allAnswered && !this.options.ask) {
                return null;
            }

            const disableOnUpdate = () => !this.context.updateMode;

            prompts = [
                {
                    type: 'input',
                    name: 'libGroup',
                    message: 'Maven artifact group',
                    validate: this.$validatePackage,
                    default: this.$defaultValue('libGroup', 'com.mycompany')
                },
                {
                    type: 'input',
                    name: 'libPackage',
                    message: 'Base package',
                    validate: this.$validatePackage,
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
                    type: 'confirm',
                    name: 'enableQualityChecks',
                    message: 'Enable code quality checks (checkstyle, pmd, findbugs)?',
                    default: this.enableQualityChecks || true
                }
            ];

            return this.$prompt(prompts, questions);
        };

        let askLibName = () => {
            if (this.context.updateMode) {
                // update must be started from project folder - no need to ask for name
                return null;
            }

            this.log(`Accept default library name ${chalk.red(this.appname)} to generate in current folder, otherwise new folder will be created`);

            prompts = [{
                name: 'libName', message: 'Library name', default: this.libName || this.appname,
                filter: this.$folderName
            }];

            return this.$prompt(prompts, ['libName']).then(props => {
                this.appname = props.libName;
                return other();
            });
        };

        return this.$prompt(prompts, questions).then(askLibName);
    }

    configuring() {

        // configure
        this.$selectTargetFolder();
        this.$saveConfiguration(questions, globals);
    }

    writing() {
        // base
        const writeOnceFiles = [
            'CHANGELOG.md',
            'README.md',
            'gradle.properties',
            'LICENSE',
            'settings.gradle'
        ];
        this.gradlewExists = this.$exists('gradlew');

        this.$copy('gradle-base', {writeOnceFiles: writeOnceFiles});

        this.$copyTpl('project-base', {writeOnceFiles: writeOnceFiles});

        if (this.multiModule) {

            // MULTI MODULE PROJECT
            this.$copyTpl('project-multi', {writeOnceFiles: writeOnceFiles});
            // generate modules only once because module would be obviously renamed after initial generation
            if (!this.context.updateMode) {
                this.$copyTpl('project-multi-modules/bom', {
                    writeOnceFiles: writeOnceFiles,
                    targetFolder: this.modulePrefix + '-bom'
                });
                const moduleDir = this.modulePrefix + '-' + this.moduleName;
                this.$copyTpl('project-multi-modules/module', {
                    writeOnceFiles: writeOnceFiles,
                    targetFolder: moduleDir
                });
                const packageFolder = this.libPackage.replace(/\./g, '/');
                this.$copyTpl('sources', {
                    pathReplace: [
                        {regex: /(^|\/)package(\/|$)/, replace: '$1' + packageFolder + '$2'}
                    ],
                    targetFolder: moduleDir
                });
            } else {
                this.log(chalk.yellow('     skip ') + 'sources generation');
            }
        } else {

            // SINGLE PROJECT
            this.$copyTpl('project-single', {writeOnceFiles: writeOnceFiles});
            // sources
            if (!this.$exists('src/main')) {
                this.$copySources(this.libPackage, 'sources');
            } else {
                this.log(chalk.yellow('     skip ') + 'sources generation');
            }
        }
    }

    end() {
        // chmod
        // setting executable flag manually
        if (!this.gradlewExists) {
            this.$setExecutableFlag('gradlew');
        }

        // check gradle config
        let conf = this.context.gradleConf || {},
            warnSign = !conf['signing.keyId'] || !conf['signing.secretKeyRingFile'],
            warnCentral = !conf.sonatypeUser || !conf.sonatypePassword;

        if (!warnSign && !warnCentral) {
            return;
        }

        this.log();
        this.log(chalk.red('IMPORTANT') + ' you need to add the following configurations to global gradle file (required for release): ' +
            '\n ' + chalk.green(this.context.gradleConfPath));
        if (warnSign) {
            this.log();
            this.log('For release artifacts signing:');
            this.log(chalk.yellow('signing.keyId') + '=<certificate id>');
            this.log(chalk.yellow('signing.password') + '=<password (empty if not set)>');
            this.log(chalk.yellow('signing.secretKeyRingFile') + '=<path to cetrificate file>');
        }
        if (warnCentral) {
            this.log();
            this.log('For maven central publication:');
            this.log(chalk.yellow('sonatypeUser') + '=<sonatype user>');
            this.log(chalk.yellow('sonatypePassword') + '=<sonatype password>');
        }
    }
};
