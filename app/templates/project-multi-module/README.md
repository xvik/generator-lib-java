# <%= libName %> <%= moduleName %> module

Description.

Features:
* Feature 1
* Feature 2

### Setup

[![JCenter](https://img.shields.io/bintray/v/<%= bintrayUser %>/<%= bintrayRepo %>/<%= libName %>.svg?label=jcenter)](https://bintray.com/<%= bintrayUser %>/<%= bintrayRepo %>/<%= libName %>/_latestVersion)
[![Maven Central](https://img.shields.io/maven-central/v/<%= libGroup %>/<%= modulePrefix %>-<%= moduleName %>.svg?style=flat)](https://maven-badges.herokuapp.com/maven-central/<%= libGroup %>/<%= modulePrefix %>-<%= moduleName %>)

Avoid version in dependency declaration below if you use [extensions BOM](../<%= modulePrefix %>-bom). 

Maven:

```xml
<dependency>
  <groupId><%= libGroup %></groupId>
  <artifactId><%= modulePrefix %>-<%= moduleName %></artifactId>
  <version><%= libVersion %></version>
</dependency>
```

Gradle:

```groovy
compile '<%= libGroup %>:<%= modulePrefix %>-<%= moduleName %>:<%= libVersion %>'
```

See the most recent version in the badge above.


### Usage


   