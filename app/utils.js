'use strict';
var url = require('url'),
    _ = require('lodash'),
    userHome = require('user-home'),
    path = require('path'),
    Configstore = require('configstore'),
    properties = require('properties'),
    fs = require('fs'),
    _s = require('underscore.string'),
    chalk = require('chalk'),
    glob = require('glob');

function Helper(gen) {
    this.$ = gen;
    this.globalConfig = new Configstore(require('../package.json').name);
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
        var targetPath = filePath;
        var configFile = targetPath ? path.join(userHome, targetPath) : userHome;
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
     * Resolves correct default value to use in prompt.
     * Checks: stored answers, global answers, provided default
     * @param name property key
     * @param value default value
     * @return default value
     */
    defaultValue: function (name, value) {
        var localConfigValue = this.$.config.get(name);
        return localConfigValue || this.globalConfig.get(name) || value;
    },

    storeGlobal: function (name, value) {
        this.globalConfig.set(name, value);
    },

    validatePackageFn: function (pkg) {
        if (/^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(pkg)) {
            return true;
        }
        return 'The package name you have provided is not a valid Java package name.';
    },

    exists: function (filePath) {
        return fs.existsSync(this.$.destinationPath(filePath));
    },

    setExecutable: function (filePath) {
        fs.chmodSync(this.$.destinationPath(filePath), '755');
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
        glob.sync(opts.glob, {cwd: this.$.templatePath(dir), nodir: true}).map(function (file) {
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
