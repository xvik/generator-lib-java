# Java library yeoman generator

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/xvik/generator-lib-java)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://www.opensource.org/licenses/MIT)
[![NPM version](https://img.shields.io/npm/v/generator-lib-java.svg)](http://badge.fury.io/js/generator-lib-java)
[![Build Status](https://secure.travis-ci.org/xvik/generator-lib-java.png)](https://travis-ci.org/xvik/generator-lib-java)

### About

The main goal is to simplify new [github](https://github.com) java library setup.

Features:
* Single and multi-module projects generation
* [MIT](http://opensource.org/licenses/MIT) license (hardcoded)
* [Gradle](http://www.gradle.org/) build (with support of optional and provided dependencies)
* [Maven central](http://search.maven.org/) compatible artifacts (jar, sources, javadocs)
* Ready for [spock](http://spockframework.org) tests ([documentation](http://docs.spockframework.org))
* [Bintray](https://bintray.com/) publication (+ jars signing and maven central publishing)
* CI: [travis](https://travis-ci.org/) (linux), [appveyor](https://www.appveyor.com/) (windows)
* Coverage with jacoco, merged from both win and linux builds in [codecov.io](https://codecov.io/)
* Target jdk compatibility check with [animal sniffer](http://mojo.codehaus.org/animal-sniffer/) (you may use newer jdk to build, and keep compatibility with older jdk)
* Code quality checks ([checkstyle](http://checkstyle.sourceforge.net/), [pmd](http://pmd.sourceforge.net/), [findbugs](http://findbugs.sourceforge.net/))
* [Release process](https://github.com/researchgate/gradle-release#introduction) (like maven release)

Requires jdk8 or above (due to checkstyle [requirement](http://checkstyle.sourceforge.net/releasenotes.html#Release_7.0)). But actual library could target any java level (jdk8 is only required for build).

### Known issue

Gradle 2.13+ has a [bug with console input](https://issues.gradle.org/browse/GRADLE-3446). As a result, 
during release version confirm questions are [not visible](https://github.com/researchgate/gradle-release/issues/185).

Issue is not blocking and only affects release process: simply hit enter for questions (and be sure version in properties file is correct). 

### Thanks to

* [Vladislav Bauer](https://github.com/vbauer) ([android-arsenal](http://android-arsenal.com/) author) for checkstyle config and [gitignore.io](https://gitignore.io) hint
* [Juan Roperto](https://github.com/jroperto) for pmd config

### Example projects

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

Most likely, some answers will be the same for all your libraries, that's why they are stored in global config and
you will see more precise defaults on next generation.

Global config stored in `~/.config/configstore/generator-lib-java.json`

### External services

Create [github](https://github.com) repo matching your library name and push project there (github will guide you).

In github project settings go to `Webhooks & services` and add `travis-ci` service.

Enable repository on services:
* [travis](https://travis-ci.org/)
* [appveyor](https://www.appveyor.com/) 

And after next commit windows and linux builds will be performed automatically and combined coverage report
will be available on [codecov](https://codecov.io/) (badges for all services are already generated in readme). 

Bintray and maven central badges are generated in readme, but commented (uncomment before release).

### Snapshots

[JitPack](https://jitpack.io) is ideal for snapshots: it builds github project and serves dependency for you.
Special section in project readme is generated to show how to use it for snapshots.
JitPack doesn't require any configuration to support your library.

Bintray is still used for releases, because:
* Maven central require jar signing, which grants secure usage of your artifact (and prevents artifact changes, 
for example, malicious injections)
* Bintray jcenter now become standard for java projects (second to maven central). It is trusted and, for example, in gradle enabled by default 
(no need to specify custom repository).
* It's not used frequently, but bintray supports user notifications about new versions.

### Gitter

[Gitter](https://gitter.im) is a chat room for your repository. Most likely, with it you
will get much more feedback (something people will never post as issue or write by email).

Gitter badge is not generated automatically, because it's not required as other services and it's too easy to add at any time.
Look it and decide if you need it.

### Documentation

You can use [gradle-mkdocs-plugin](https://github.com/xvik/gradle-mkdocs-plugin) for writing versioned project documentation
(published on github pages).

### Project usage

```bash
$ gradlew check
```

Runs code quality plugins and tests. If quality checks were activated (asked during generation) do check before pushing to avoid
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

### Project details

[Sample build file](https://github.com/xvik/generator-lib-java/wiki/Build-file-annotated) with comments.

Used gradle plugins:
* [java](http://www.gradle.org/docs/current/userguide/java_plugin.html)
* [groovy](http://www.gradle.org/docs/current/userguide/groovy_plugin.html) to support spock tests
* [maven-publish](http://www.gradle.org/docs/current/userguide/publishing_maven.html) to generate pom and publish to maven repository
* [project-report](http://www.gradle.org/docs/current/userguide/project_reports_plugin.html) to generate dependency tree html report
* [jacoco](http://www.gradle.org/docs/current/userguide/jacoco_plugin.html) to build coverage report for coveralls
* [pmd](http://www.gradle.org/docs/current/userguide/pmd_plugin.html) to check code quality with [PMD](http://pmd.sourceforge.net/) tool
* [checkstyle](http://www.gradle.org/docs/current/userguide/checkstyle_plugin.html) to check code style rules with [checkstyle](http://checkstyle.sourceforge.net/index.html)
* [findbugs](http://www.gradle.org/docs/current/userguide/findbugs_plugin.html) to find potential bugs with [findbugs](http://findbugs.sourceforge.net/)
* [com.jfrog.bintray](https://github.com/bintray/gradle-bintray-plugin) for bintray publishing
* [com.github.ben-manes.versions](https://github.com/ben-manes/gradle-versions-plugin) to check dependencies versions updates
* [net.researchgate.release](https://github.com/researchgate/gradle-release) for release (see [article](http://www.sosaywecode.com/gradle-release-plugin/) for additional plugin details)
* [ru.vyarus.pom](https://github.com/xvik/gradle-pom-plugin) for simpler pom generation
* [ru.vyarus.java-lib](https://github.com/xvik/gradle-java-lib-plugin) to prepare java artifacts setup
* [ru.vyarus.github-info](https://github.com/xvik/gradle-github-info-plugin) to fill in github specific data
* [ru.vyarus.quality](https://github.com/xvik/gradle-quality-plugin) to configure quality plugins and provide advanced reporting
* [ru.vyarus.animalsniffer](https://github.com/xvik/gradle-animalsniffer-plugin) to verify jdk backwards compatibility when building on newer jdk
* [io.spring.dependency-management](https://github.com/xvik/gradle-animalsniffer-plugin) to use maven BOMs (plugin used instead of gradle native BOM's support as more correct)

#### Optional dependencies

Optional and provided dependencies support provided by [ru.vyarus.pom plugin](https://github.com/xvik/gradle-pom-plugin).

Example usage:

```groovy
provided 'com.github.spotbugs:spotbugs-annotations:3.1.2'
```

or

```groovy
optional 'com.github.spotbugs:spotbugs-annotations:3.1.2'
```

In generated pom these dependencies will be defined as provided or optional, but for gradle build it's
the same as declaring them in `compile` scope.

jsr305 provided dependency is defined by default in generated project (useful to guide firebug). 

Scala note: The Scala compiler, unlike the Java compiler, [requires that annotations used by a library be available when
compiling against that library](https://issues.scala-lang.org/browse/SI-5420).
If your library users will compile with Scala, they must declare a dependency on JSR-305 jar.

#### Java compatibility

It still makes sense to keep library compatibility with older java version (6 or 7), even when newer java used for development.

But when project compiled with newer jdk, there is a chance to use newer api, not available in target (older) jdk. 
[ru.vyarus.animalsniffer plugin](https://github.com/xvik/gradle-animalsniffer-plugin) checks jdk api usage. 
 
There is special dependency configuration `signature` which defines target signature to check, e.g.:

```groovy
signature 'org.codehaus.mojo.signature:java16-sun:+@signature'
```
 
When no signatures defined, no check will be performed.

### Quality tools

Quality tools are configured by [ru.vyarus.quality plugin](https://github.com/xvik/gradle-quality-plugin).

Read more about quality tools specifics and how to suppress warnings:
* [checkstyle](http://xvik.github.io/gradle-quality-plugin/3.0.0/tool/checkstyle/)
* [pmd](http://xvik.github.io/gradle-quality-plugin/3.0.0/tool/pmd/)
* [spotbugs](http://xvik.github.io/gradle-quality-plugin/3.0.0/tool/spotbugs/)

By default, quality checks fail build if any violation found. In order to simply report violations do:

```groovy
quality {
    strict = false
}
```

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

You may want to create github release: release will only create tag. To create release go to github releases, click on tag and press 'edit'.
I usually use text from changelog as release message, but you may expand it with other release specific notes.

#### After first release

Github repository name and changelog file will be [automatically configured](https://github.com/xvik/gradle-github-info-plugin#comjfrogbintray) 
for bintray plugin. If you renamed changelog file from CHANGELOG.md then you will have to [specify it's name](https://github.com/xvik/gradle-github-info-plugin#available-properties)
(or configure it manually on bintray package edit page).
Go to your bintray package page, click on 'readme' tab and select 'github page'.
Do the same on 'release notes' tab (to show CHANGELOG.md file).

After actual release press 'add to jcenter' button to request jcenter linking (required for maven central publication
and even if you don't want to sync to maven central, linking to jcenter will simplify library usage for end users).

After acceptance in jcenter (approve takes less than 1 day) do manual maven central synchronization in bintray ui.

Now automatic maven central publication could be enabled in project config `build.gradle`:

```
bintray {
        ...
        mavenCentralSync {
            sync = true
```

Note that maven publication requires files signing option active too (if you not choose it during project generation):

```
        gpg {
            sign = true
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

