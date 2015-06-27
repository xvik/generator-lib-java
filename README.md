#Java library yeoman generator

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/xvik/generator-lib-java)
[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/MIT)
[![NPM version](http://img.shields.io/npm/v/generator-lib-java.svg?style=flat)](http://badge.fury.io/js/generator-lib-java)
[![Build Status](https://secure.travis-ci.org/xvik/generator-lib-java.png?branch=master)](https://travis-ci.org/xvik/generator-lib-java)

### About

The main goal is to simplify new [github](https://github.com) java library setup.
Also simplifies existing build upgrade.

Features:
* [MIT](http://opensource.org/licenses/MIT) license (hardcoded)
* [Gradle](http://www.gradle.org/) build (with support of optional and provided dependencies)
* [Maven central](http://search.maven.org/) compatible artifacts (jar, sources, javadocs)
* Ready for [spock](http://spockframework.org) tests ([documentation](http://docs.spockframework.org))
* [Bintray](https://bintray.com/) publication (+ jars signing and maven central publishing)
* [Travis-ci](https://travis-ci.org/) integration (CI and healthy badge)
* [Coveralls](http://coveralls.io/) integration (code coverage badge)
* Target jdk compatibility check with [animal sniffer](http://mojo.codehaus.org/animal-sniffer/) (you may use newer jdk to build, and keep compatibility with older jdk)
* Code quality checks ([checkstyle](http://checkstyle.sourceforge.net/), [pmd](http://pmd.sourceforge.net/), [findbugs](http://findbugs.sourceforge.net/))
* [Release process](https://github.com/researchgate/gradle-release#introduction) (like maven release)

Requires jdk7 or above.

### Thanks to

* [Vladislav Bauer](https://github.com/vbauer) ([android-arsenal](http://android-arsenal.com/) author) for checkstyle config and [gitignore.io](https://gitignore.io) hint
* [Juan Roperto](https://github.com/jroperto) for pmd config

### Example projects

I'm using generator to synchronize builds of projects

* [guice-persist-orient](https://github.com/xvik/guice-persist-orient)
* [guice-ext-annotations](https://github.com/xvik/guice-ext-annotations)
* [guice-validator](https://github.com/xvik/guice-validator)
* [dropwizard-orient-server](https://github.com/xvik/dropwizard-orient-server)
* [dropwizard-guicey](https://github.com/xvik/dropwizard-guicey)
* [generics-resolver](https://github.com/xvik/generics-resolver)

### Setup

Install [yeoman](http://yeoman.io/):

```bash
$ npm install -g yo
```

Install generator:

```bash
$ npm install -g generator-lib-java
```

##### Update

To update generator:

```bash
$ npm update -g generator-lib-java
```

Generator gets updated often with new versions of gradle, plugins or quality tools.

### Github setup

You will need [github](https://github.com) user. Create it if you don't have already.

### Bintray setup

Bintray automates files signing and maven central publishing.
Project already generates valid artifacts for maven central, you just need to configure bintray.

Sign up [bintray](https://bintray.com/) and create maven repository to upload artifacts to (it's name is one of generator questions).

[Follow instruction](https://medium.com/@vyarus/the-hard-way-to-maven-central-c9e16d163acc)

Add bintray user and key to `~/.gradle/gradle.properties`

```
bintrayUser=username
bintrayKey=secretkey
```

If you will use automatic signing and certificate requires passphrase:

```
gpgPassphrase=passphrase
```

If you will use automatic maven central publishing add:

```
sonatypeUser=username
sonatypePassword=password
```

Generator will check and warn you if something is not configured.

### Usage

> General convention: project name == github project name == bintray package page

Run generator:

```bash
$ yo lib-java
```

Generator creates project in current folder if project name (question) is the same as current directory,
and will create subdirectory otherwise.

Generator calls github to validate user correctness and suggest your name and email. If there is a problem with it use offline mode:

```bash
$ yo lib-java --offline
```

NOTE: even if you chose syncing with maven central, build.gradle will contain false on initial generation, because
it's impossible to use it on first release (package needs to be added to jcenter). See release section for more details.
Anyway, your answer will be stored and on update (next generation) correct value will be set to config.

Project setup ready, start coding!

#### Build upgrade

If generator started in folder with already generated project - it will work in update mode.
This will allow you to easily update existing build with new generator version.

Update mode skips some files to reduce update to only meaningful files (e.g. no need to update CHANGELOG.md, gradle.properties etc).
Update will use previous answers by default.

Start update without local changes and after generation look git changes and correct
(usually only main build.gradle requires modifications after update).

#### Global storage

Most likely some answers will be the same for all your libraries, that's why they are stored in global config and
you will see more precise defaults on next generation.

Global config stored in `~/.config/configstore/generator-lib-java.yml`

### External services

Create [github](https://github.com) repo matching your library name and push project there (github will guide you).

In github project settings go to `Webhooks & services` and add `travis-ci` service.

Go to [travis](https://travis-ci.org/) and enable your repo.

Go to [coveralls](http://coveralls.io/) and enable your repo.

Bintray and maven central badges are generated in readme, but commented (uncomment before release).

### Gitter

[Gitter](https://gitter.im) is a chat room for your repository. Most likely, with it you
will get much more feedback (something people will never post as issue or write by email).

Gitter badge is not generated automatically, because it's not required as other services and it's too easy to add at any time.
Look it and decide if you need it.

### Project usage

```bash
$ gradlew check
```

Runs code quality plugins. If quality checks were activated (asked during generation) do check before pushing to avoid
build failures on travis. Moreover, it's easy to always keep everything clean instead of doing it before release.

```bash
$ gradlew dependencyUpdates
```

Checks if your project dependencies are actual and prints versions analysis report to console.

```bash
$ gradlew dependencies
```

Prints dependencies tree into console

```bash
$ gradlew showDependenciesTree
```

Generates dependencies html report and launch it in default browser.
To analyze conflicts, click on dependency name to activate
[dependencyInsight](http://www.gradle.org/docs/current/groovydoc/org/gradle/api/tasks/diagnostics/DependencyInsightReportTask.html) popup.

```bash
$ gradlew install
```

Installs library to local maven repository. Useful for referencing by other projects (for testing without releasing library).

```bash
$ gradlew release
```

Releases library. Read release process section below before performing first release.


#### Optional dependencies

Optional and provided dependencies could be defined, for example:

```groovy
provided 'com.google.code.findbugs:jsr305:3.0.0'
```

or

```groovy
optional 'com.google.code.findbugs:jsr305:3.0.0'
```

In generated pom these dependencies will be defined as provided or optional, but for gradle build it's
the same as declaring them in `compile` scope.

jsr305 provided dependency is defined by default in generated project (useful to guide firebug).

Scala note: The Scala compiler, unlike the Java compiler, [requires that annotations used by a library be available when
compiling against that library](https://issues.scala-lang.org/browse/SI-5420).
If your library users will compile with Scala, they must declare a dependency on JSR-305 jar.

### Project details

All project specific data (mostly inserted with generator) is in `build.gradle` file.
`project.ext` section contains configuration objects definitions.
These definitions are extended using conventions (see `github.gradle`, `bintray.gradle`).

Project dependencies are specified in `build-deps.gradle`. This simplifies library upgrade and a bit more handy to use
(because dependencies are checked or updated much more often then all other config).

Used gradle plugins:
* [java](http://www.gradle.org/docs/current/userguide/java_plugin.html)
* [groovy](http://www.gradle.org/docs/current/userguide/groovy_plugin.html) to support spock tests
* [maven-publish](http://www.gradle.org/docs/current/userguide/publishing_maven.html) to generate pom and publish to maven repository
* [com.jfrog.bintray](https://github.com/bintray/gradle-bintray-plugin) for bintray publishing
* [com.github.ben-manes.versions](https://github.com/ben-manes/gradle-versions-plugin) to check dependencies versions updates
* [project-report](http://www.gradle.org/docs/current/userguide/project_reports_plugin.html) to generate dependency tree html report
* [jacoco](http://www.gradle.org/docs/current/userguide/jacoco_plugin.html) to build coverage report for coveralls
* [com.github.kt3k.coveralls](https://github.com/kt3k/coveralls-gradle-plugin) to send coverage report to coveralls
* [pmd](http://www.gradle.org/docs/current/userguide/pmd_plugin.html) to check code quality with [PMD](http://pmd.sourceforge.net/) tool
* [checkstyle](http://www.gradle.org/docs/current/userguide/checkstyle_plugin.html) to check code style rules with [checkstyle](http://checkstyle.sourceforge.net/index.html)
* [findbugs](http://www.gradle.org/docs/current/userguide/findbugs_plugin.html) to find potential bugs with [findbugs](http://findbugs.sourceforge.net/)
* [be.insaneprogramming.gradle.animalsniffer](https://bitbucket.org/lievendoclo/animalsniffer-gradle-plugin) to verify jdk backwards compatibility when building on newer jdk
* [release](https://github.com/researchgate/gradle-release) for release (see [article](http://www.sosaywecode.com/gradle-release-plugin/) for additional plugin details)

#### Java compatibility

I prefer to use more recent jdk for build because recent checkstyle and findbugs requires it and also new jdk features
could be used in tests. But it's better for resulted library is be compatible with older jdk's.

To do compatibility we use target jvm flag (to get correct class file version) and animalsniffer plugin to
guarantee that we havn't used any recent api in project (not available in older jdk).

See build config section in `build.gradle`:

```groovy
    build = {
        ...
        java = 1.6
        signature = 'org.codehaus.mojo.signature:java16-sun:+@signature'
```

`java` option defines target and source java compiler options.

`signature` defines [animal sniffer](http://mojo.codehaus.org/animal-sniffer/) signature to check.
With it you can use any jdk while developing and if you accidentally use newer api than defined in signature
it will warn you on compilation. You can find [other signatures in maven central](http://search.maven.org/#search%7Cga%7C2%7Csignature).
To switch off animal sniffer check simply set signature value to `''`

Known issue: sometimes gradle build failed on animal sniffer task with generic error. In this case simply execute gradle clean
and issue will be resolved (issue occur because of IDE).

### Quality tools

Quality tools are configured in `gradle/quality.gradle`. Tools configuration files could be found in `gradle/config/*`.

All quality plugins are configured to fail build. All found issues are printed to console with description, so most of the time
console output is enough to understand and fix problem.

#### Checkstyle

[Checkstyle rules documentation](http://checkstyle.sourceforge.net/availablechecks.html)

To suppress checkstyle warnings (required for some exceptional cases) use `@SuppressWarnings` annotation with
value composed as `checkstyle:` prefix and lowercased checkstyle check name:

```java
@SuppressWarnings("checkstyle:classdataabstractioncoupling")
```

To suppress all checkstyle checks in class comments syntax could be used before class:

```java
// CHECKSTYLE:OFF
```

Also, use checkstyle plugin for your IDE (for example, CheckStyle-IDEA for idea) and set your checkstyle configuration
for plugin. This way you will see issues quicker and will have to do less cleanups before commit (where you will call
quality checks).


#### PMD

[PMD rules documentation](http://pmd.sourceforge.net/pmd-5.2.3/pmd-java/rules/index.html)

To suppress PMD violation use (in case PMD makes a mistake):

```java
@SuppressWarnings("PMD.checkName")
```

To suppress all PMD checks in class:

```java
@SuppressWarnings("PMD")
```

Pmd configuration file: `gradle/config/pmd/pmd.xml`

#### Findbugs

[Findbugs detected bugs descriptions](http://findbugs.sourceforge.net/bugDescriptions.html)

To suppress findbugs warnings you can use [exclusion filter](http://findbugs.sourceforge.net/manual/filter.html) (gradle/config/findbugs/exclude.xml).
Findbug does not support @SuppressWarnings, instead you can use it's own [@SuppressFBWarnings](http://findbugs.sourceforge.net/api/edu/umd/cs/findbugs/annotations/SuppressFBWarnings.html)
(but you will have to add dependency for annotations `'com.google.code.findbugs:annotations:3.0.0'`)

You may face issue with guava functions or predicates:

```
input must be nonnull but is marked as nullable [NP_PARAMETER_MUST_BE_NONNULL_BUT_MARKED_AS_NULLABLE]
```

The reason for this is that guava use `@Nullable` annotation, which is `@Inherited`, so
even if you not set annotation on your own function or predicate it will still be visible,

The simplest workaround is to set `@Nonnull` annotaion (from jsr305 jar included by default) on your function or predicate:

```java
public boolean apply(@Nonnull final Object input) {
```

Also, it's good idea to use jsr305 annotations to guide findbugs.

### Release process

#### Before first release

When releasing first time it's better to do

```bash
$ gradlew install
```

And validate generated pom file and jars (in local maven repository ~/.m2/repository/..).

NOTE: Release plugin requires access to git repository without credentials, so it's
better to allow storing credentials when using git console.
Windows users with sysgit 1.8.1 and up could use:

```bash
$ git config --global credential.helper wincred
```

To [avoid problems](https://github.com/townsfolk/gradle-release/issues/81).

Bintray and maven central badges are commented in readme - uncomment them (remove maven badge if not going to publish there)

Automatic maven central publication is impossible on first release, because package is not yet in jcentral (we will enable it after).

#### General release process

Update `CHANGELOG.md`.

Push all changes before release and wait for `travis` to check build (wait for green badge).

Perform release:

```bash
$ gradlew release
```

Release will check that current copy is actual: no uncommitted/unversioned/unpushed changes, nothing newer is in remote repository.
You can start releasing either from snapshot version (1.0.0-SNAPSHOT) or from normal one (1.0.0).

During release, plugin will create tag (new github release appear) and update version in `gradle.properties`.

NOTE: Sometimes release plugin [did not set 'SNAPSHOT' postfix](https://github.com/townsfolk/gradle-release/issues/64) to new version.

You may want to create github release: release will only create tag. To create release go to github releases, click on tag and press 'edit'.
I usually use text from changelog as release message, but you may expand it with other release specific notes.

#### After first release

Current bintray rest api did not allow to link github readme and changelog file automatically.
So you will have to go to your package page and edit package: fill in github repository name (user/repo-name) and
the name of changes file (CHANGELOG.md). After that click on 'readme' tab on package page and select 'github page'.
Do the same on 'release notes' tab.

After actual release press 'add to jcenter' button to request jcenter linking (required for maven central publication
and even if you dont want to sync to maven central, linking to jcenter will simplify library usage for end users).

After acceptance in jcenter do manual maven central synchronization in bintray ui.

Now automatic maven central publication could be enabled in project config `build.gradle`:

```
project.ext {
    ...
    bintray = {
        ...
        mavenCentralSync = true
```

Note that maven publication requires files signing option active too (if you not choose it during project generation):

```
signFiles = true
```

All future releases will publish to maven central automatically.

#### If release failed

Nothing bad could happen.

If bintray upload failed, you can always upload one more time.
If you uploaded bad version and want to re-release it, simply remove version files on bintray package version page and re-do release.

If release failed, but plugin already commit new version - you can release again from this state (no need to revert).

Release plugin changes only version in `gradle.properties` and creates git tag.
Version could be reverted manually (by correcting file) and git tag could be also removed like this:

```bash
git tag -d release01
git push origin :refs/tags/release01
```

### Support

[Gitter chat room](https://gitter.im/xvik/generator-lib-java)

