# <%= libName %>
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/travis/<%= githubUser %>/<%= libName %>.svg?style=flat&branch=master)](https://travis-ci.org/<%= githubUser %>/<%= libName %>)
[![Appveyor build status](https://ci.appveyor.com/api/projects/status/github/<%= githubUser %>/<%= libName %>?svg=true)](https://ci.appveyor.com/project/<%= githubUser %>/<%= libName %>)
[![codecov](https://codecov.io/gh/<%= githubUser %>/<%= libName %>/branch/master/graph/badge.svg)](https://codecov.io/gh/<%= githubUser %>/<%= libName %>)

### About

<%= libDesc %>

### Setup
 
Releases are published to [bintray jcenter](https://bintray.com/<%= bintrayUser %>/<%= bintrayRepo %>/<%= libName %>/) and 
[maven central](https://maven-badges.herokuapp.com/maven-central/<%= libGroup %>/<%= libName %>) 

[![JCenter](https://img.shields.io/bintray/v/<%= bintrayUser %>/<%= bintrayRepo %>/<%= libName %>.svg?label=jcenter)](https://bintray.com/<%= bintrayUser %>/<%= bintrayRepo %>/<%= libName %>/_latestVersion)
[![Maven Central](https://img.shields.io/maven-central/v/<%= libGroup %>/<%= libName %>.svg?style=flat)](https://maven-badges.herokuapp.com/maven-central/<%= libGroup %>/<%= libName %>)

You can either use [modules](#modules) directly (in this case see module page for setup) or use provided [BOM](<%= modulePrefix %>-bom)
to unify versions management.

[BOM usage](<%= modulePrefix %>-bom#setup) is recommended. 

### Modules

#### [Module](<%= modulePrefix %>-<%= moduleName %>)

Module description.

---
[![java lib generator](http://img.shields.io/badge/Powered%20by-%20Java%20lib%20generator-green.svg?style=flat-square)](https://github.com/xvik/generator-lib-java)