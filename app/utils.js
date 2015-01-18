'use strict';
var url = require('url'),
    _ = require('lodash'),
    path = require('path'),
    properties = require('properties'),
    fs = require('fs'),
    _s = require('underscore.string'),
    detectConflict = require('detect-conflict'),
    chalk = require('chalk');

function Helper(gen) {
    this.$ = gen;
}

_.extend(Helper.prototype, {

    initGithubApi: function () {
        /* jshint -W106 */
        var proxy = process.env.http_proxy || process.env.HTTP_PROXY || process.env.https_proxy ||
            process.env.HTTPS_PROXY || null;
        /* jshint +W106 */
        var githubOptions = {
            version: '3.0.0'
        };

        if (proxy) {
            var proxyUrl = url.parse(proxy);
            githubOptions.proxy = {
                host: proxyUrl.hostname,
                port: proxyUrl.port
            };
        }

        var GitHubApi = require('github');
        return new GitHubApi(githubOptions);
    },

    twoDigits: function (num) {
        return num < 10 ? '0' + num : num;
    },

    homePath: function (filePath) {
        var targetPath = filePath || '';
        if (targetPath.indexOf('/') !== 0) {
            targetPath = '/' + targetPath;
        }
        var homeDir = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH,
            configFile = homeDir + targetPath;
        return path.normalize(configFile);
    },

    readProperties: function (filePath, cb) {
        if (fs.existsSync(filePath)) {
            properties.parse(filePath, {path: true}, function (error, obj) {
                cb(error ? null : obj);
            });
        } else {
            cb(null);
        }
    },

    banner: function (filePath) {
        return fs.readFileSync(filePath).toString();
    },

    folderName: function (name) {
        return _s.slugify(name).toLowerCase();
    },

    /**
     * Checks if global setting contradict with value stored in local config.
     * If they are different and we mark prompt as store:true, then yo will show global value
     * and not the one from local config, which is wrong
     * @param name config property
     * @return true if store can be used, false otherwise
     */
    canUseGlobalStore: function (name) {
        var globalConfig = this.$._globalConfig.get('promptValues');
        var localConfigValue = this.$.config.get(name);
        // no global config or no local value or values are the same in both configs
        return !globalConfig || _.isUndefined(globalConfig[name]) ||
            (!_.isUndefined(localConfigValue) && globalConfig[name] === localConfigValue);
    },

    validatePackageFn: function (pkg) {
        if (/^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(pkg)) {
            return true;
        }
        return 'The package name you have provided is not a valid Java package name.';
    },

    detectConflict: function (sourcePath, targetPath) {
        var content = fs.readFileSync(sourcePath);
        return detectConflict(targetPath, content);
    },

    bulkChangeCopy: function (sourcePath, targetPath) {
        var src = this.$.templatePath(sourcePath);
        var dest = this.$.destinationPath(targetPath);
        if (!fs.existsSync(dest) || this.detectConflict(src, dest)) {
            this.$.bulkCopy(
                src,
                dest
            );
        } else {
            this.$.log(chalk.cyan('identical ') + dest.substr(this.$.destinationPath().length + 1));
        }
    },

    exists: function (filePath) {
        return fs.existsSync(this.$.destinationPath(filePath));
    },

    /**
     * Supported options:
     * glob - glob pattern, by default '**'
     * processDotfiles - replace file names started with '_' to '.', default true
     * writeOnceFiles - array of target files which must not be overridden (write once, usually on initial generation), default []
     * pathReplace - array of replace objects : {regex: , replace:} to replace parts of original path to get target path
     * @param copyFn function used for actual copy
     * @param dir templates source directory
     * @param options options object
     */
    smartCopy: function (copyFn, dir, options) {
        var opts = options || {};
        _.defaults(opts, {
            glob: '**',
            processDotfiles: true,
            writeOnceFiles: [],
            pathReplace: []
        });
        if (!_s.endsWith(dir, '/')) {
            dir += '/';
        }
        this.$.expandFiles(opts.glob, {cwd: this.$.templatePath(dir)}).map(function (file) {
            var targetFile = file;
            if (opts.processDotfiles) {
                targetFile = targetFile.replace(/^_|\/_/, '/.'); // replace _ to  .
            }
            targetFile = targetFile.replace(/^\//, ''); // remove trailing slash

            opts.pathReplace.forEach(function (desc) {
                targetFile = targetFile.replace(desc.regex, desc.replace);
            });

            var dest = this.$.destinationPath(targetFile);
            if (_.contains(opts.writeOnceFiles, targetFile) && fs.existsSync(dest)) {
                this.$.log(chalk.yellow('     skip ') + path.normalize(targetFile));
                return;
            }
            var source = this.$.templatePath(dir + file);
            copyFn(source, dest);
        }.bind(this), this.$);
    },

    copy: function (dir, options) {
        this.smartCopy(this.$.fs.copy.bind(this.$.fs), dir, options);
    },

    copyTpl: function (dir, options) {
        this.smartCopy(function (src, dest) {
            this.$.fs.copyTpl(src, dest, this.$);
        }.bind(this), dir, options);
    }
});

module.exports = Helper;
