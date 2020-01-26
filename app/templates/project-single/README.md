# <%= libName %>
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/travis/<%= githubUser %>/<%= libName %>.svg?style=flat&branch=master)](https://travis-ci.org/<%= githubUser %>/<%= libName %>)
[![Appveyor build status](https://ci.appveyor.com/api/projects/status/github/<%= githubUser %>/<%= libName %>?svg=true)](https://ci.appveyor.com/project/<%= githubUser %>/<%= libName %>)
[![codecov](https://codecov.io/gh/<%= githubUser %>/<%= libName %>/branch/master/graph/badge.svg)](https://codecov.io/gh/<%= githubUser %>/<%= libName %>)


### About

<%= libDesc %>

Features:
* Feature 1
* Feature 2

### Setup
 
Releases are published to [bintray jcenter](https://bintray.com/<%= bintrayUser %>/<%= bintrayRepo %>/<%= libName %>/) and 
[maven central](https://maven-badges.herokuapp.com/maven-central/<%= libGroup %>/<%= libName %>) 

[![JCenter](https://img.shields.io/bintray/v/<%= bintrayUser %>/<%= bintrayRepo %>/<%= libName %>.svg?label=jcenter)](https://bintray.com/<%= bintrayUser %>/<%= bintrayRepo %>/<%= libName %>/_latestVersion)
[![Maven Central](https://img.shields.io/maven-central/v/<%= libGroup %>/<%= libName %>.svg?style=flat)](https://maven-badges.herokuapp.com/maven-central/<%= libGroup %>/<%= libName %>)

Maven:

```xml
<dependency>
  <groupId><%= libGroup %></groupId>
  <artifactId><%= libName %></artifactId>
  <version><%= libVersion %></version>
</dependency>
```

Gradle:

```groovy
implementation '<%= libGroup %>:<%= libName %>:<%= libVersion %>'
```

##### Snapshots

You can use snapshot versions through [JitPack](https://jitpack.io):

* Go to [JitPack project page](https://jitpack.io/#<%= githubUser %>/<%= libName %>)
* Select `Commits` section and click `Get it` on commit you want to use (top one - the most recent)
* Follow displayed instruction: add repository and change dependency (NOTE: due to JitPack convention artifact group will be different)

### Usage

---
[![java lib generator](http://img.shields.io/badge/Powered%20by-%20Java%20lib%20generator-green.svg?style=flat-square)](https://github.com/xvik/generator-lib-java)