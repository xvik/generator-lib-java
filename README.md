# Java library yeoman generator

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/xvik/generator-lib-java)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://www.opensource.org/licenses/MIT)
[![NPM version](https://img.shields.io/npm/v/generator-lib-java.svg)](http://badge.fury.io/js/generator-lib-java)
[![Build Status](https://travis-ci.com/xvik/generator-lib-java.svg?branch=master)](https://travis-ci.com/xvik/generator-lib-java)


### About

Generates java library project (or multi-module library), hosted on github with maven central publication.
Ideal for new OSS project quick start.

Features:
* Single and multi-module projects generation
* [MIT](http://opensource.org/licenses/MIT) license (hardcoded)
* [Gradle](http://www.gradle.org/) build (with support of optional and provided dependencies)
* [Maven central](http://search.maven.org/) compatible artifacts (jar, sources, javadocs)
* Ready for [spock](http://spockframework.org) tests ([documentation](http://docs.spockframework.org))
* CI: github actions (linux), [appveyor](https://www.appveyor.com/) (windows)
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

### Maven central setup

For maven central publication you must first register in sonatype and approve your group.
Read this a bit [outdated article](https://medium.com/@vyarus/the-hard-way-to-maven-central-c9e16d163acc)
for getting started.

For certificate generation see [java-lib plugin docs](https://github.com/xvik/gradle-java-lib-plugin#signing)
Note that signing configuration required only for release (otherwise its ignored)

After all you'll need to put the following properties into `~/.gradle/gradle.properties`

```
sonatypeUser =
sonatypePassword =

signing.keyId = 78065050
signing.password =
signing.secretKeyRingFile = /path/to/certs.gpg
```

Generator will check and warn you if something is not configured.

### Publishing library to local repository only

If library is assumed to be used as internal library with local (corporate) maven repo,
manual modifications required.

Remove `io.github.gradle-nexus.publish-plugin`.

Remove `ru.vyarus.github-info` (I assume your source would not be in github). And remove related
`github` configuration block.

Remove `signing` plugin if you don't need to sign artifacts for your repository.

Configure repository:

```groovy
publishing {
    repositories {
        maven {
            url project.version.contains("SNAPSHOT")
                    ? "https://my-private-nexus.com/nexus/content/repositories/my-snapshots"
                    : "https://my-private-nexus.com/nexus/content/repositories/my-releases"
            credentials {
                username = project.findProperty('myRepoUser')
                password = project.findProperty('myRepoPass')
            }
        }
    }
}
```

Change releasing task:

```groovy
afterReleaseBuild {
    dependsOn = [publish]
```

Now simple `publish` task deploys snapshot version and `release` task would perform complete release
(with version change and tagging git).

To use published library declare custom repository in target project:

```groovy
repositories {
    // usually root repo combining releases and snapshots
    maven { url 'https://my-private-nexus.com/nexus/content/groups/my/' }
}
```

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

Enable repository on [appveyor](https://www.appveyor.com/) 

And after next commit windows and linux builds will be performed automatically and combined coverage report
will be available on [codecov](https://codecov.io/) (badges for all services are already generated in readme). 

Maven central badge is generated in readme.

### Snapshots

[JitPack](https://jitpack.io) is ideal for snapshots: it builds github project and serves dependency for you.
Special section in project readme is generated to show how to use it for snapshots.
JitPack doesn't require any configuration to support your library.

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
$ gradlew openDependencyReport
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

Used gradle plugins:
* [java](http://www.gradle.org/docs/current/userguide/java_plugin.html)
* [groovy](http://www.gradle.org/docs/current/userguide/groovy_plugin.html) to support spock tests
* [maven-publish](http://www.gradle.org/docs/current/userguide/publishing_maven.html) to generate pom and publish to maven repository
* [project-report](http://www.gradle.org/docs/current/userguide/project_reports_plugin.html) to generate dependency tree html report
* [jacoco](http://www.gradle.org/docs/current/userguide/jacoco_plugin.html) to build coverage report for coveralls
* [pmd](http://www.gradle.org/docs/current/userguide/pmd_plugin.html) to check code quality with [PMD](http://pmd.sourceforge.net/) tool
* [checkstyle](http://www.gradle.org/docs/current/userguide/checkstyle_plugin.html) to check code style rules with [checkstyle](http://checkstyle.sourceforge.net/index.html)
* [spotbugs](https://github.com/spotbugs/spotbugs-gradle-plugin) to find potential bugs with [spotbugs](https://spotbugs.github.io/)
* [o.github.gradle-nexus.publish-plugin](https://github.com/gradle-nexus/publish-plugin) to simplify maven central publication
* [com.github.ben-manes.versions](https://github.com/ben-manes/gradle-versions-plugin) to check dependencies versions updates
* [net.researchgate.release](https://github.com/researchgate/gradle-release) for release (see [article](http://www.sosaywecode.com/gradle-release-plugin/) for additional plugin details)
* [ru.vyarus.pom](https://github.com/xvik/gradle-pom-plugin) for simpler pom generation
* [ru.vyarus.java-lib](https://github.com/xvik/gradle-java-lib-plugin) to prepare java artifacts setup
* [ru.vyarus.github-info](https://github.com/xvik/gradle-github-info-plugin) to fill in github specific data
* [ru.vyarus.quality](https://github.com/xvik/gradle-quality-plugin) to configure quality plugins and provide advanced reporting

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

In the generated pom these dependencies will be defined as provided or optional, but for gradle build it's
the same as declaring them in `implementation` scope.

jsr305 provided dependency is defined by default in generated project (useful to guide firebug). 

Scala note: The Scala compiler, unlike the Java compiler, [requires that annotations used by a library be available when
compiling against that library](https://issues.scala-lang.org/browse/SI-5420).
If your library users will compile with Scala, they must declare a dependency on JSR-305 jar.

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

### Support

[Gitter chat room](https://gitter.im/xvik/generator-lib-java)

