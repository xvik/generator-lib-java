# <%= libName %> <%= moduleName %> module

Description.

Features:
* Feature 1
* Feature 2

### Setup

[![Maven Central](https://img.shields.io/maven-central/v/<%= libGroup %>/<%= modulePrefix %>-<%= moduleName %>.svg?style=flat)](https://maven-badges.herokuapp.com/maven-central/<%= libGroup %>/<%= modulePrefix %>-<%= moduleName %>)

Avoid version in dependency declaration below if you use [BOM](../). 

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
implementation '<%= libGroup %>:<%= modulePrefix %>-<%= moduleName %>:<%= libVersion %>'
```

See the most recent version in the badge above.


### Usage


   