# <%= libName %> BOM module

Provides:

* Lib1 bom
* Additional dependencies used by modules 

### Setup

[![JCenter](https://img.shields.io/bintray/v/<%= bintrayUser %>/<%= bintrayRepo %>/<%= libName %>.svg?label=jcenter)](https://bintray.com/<%= bintrayUser %>/<%= bintrayRepo %>/<%= libName %>/_latestVersion)
[![Maven Central](https://img.shields.io/maven-central/v/<%= libGroup %>/<%= modulePrefix %>-bom.svg?style=flat)](https://maven-badges.herokuapp.com/maven-central/<%= libGroup %>/<%= modulePrefix %>-bom)


Maven:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId><%= libGroup %></groupId>
            <artifactId><%= modulePrefix %>-bom</artifactId>
            <version><%= libVersion %></version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<!-- declare modules without versions -->
<dependencies>
    <dependency>
      <groupId><%= libGroup %></groupId>
      <artifactId><%= modulePrefix %>-<%= moduleName %></artifactId>
    </dependency>    
</dependencies>
```

Gradle:

```groovy
plugins {
    id "io.spring.dependency-management" version "1.0.9.RELEASE"
}

dependencyManagement {    
    imports {
        mavenBom "<%= libGroup %>:<%= modulePrefix %>-bom:<%= libVersion %>"
    }
}

// declare modules without versions 
dependencies {
    implementation '<%= libGroup %>:<%= modulePrefix %>-<%= moduleName %>'    
}
    
```

Spring's [dependency management plugin](https://github.com/spring-gradle-plugins/dependency-management-plugin) is required to import BOM.
It is recommended to use it instead of [built-in gradle bom support](https://docs.gradle.org/current/userguide/migrating_from_maven.html#migmvn:using_boms)
because of [more correct spring plugin behaviour](https://github.com/spring-gradle-plugins/dependency-management-plugin/issues/211#issuecomment-387362326)

### Dependencies override

You may override BOM version for any dependency by simply specifying exact version in dependecy declaration section.

If you want to use newer version (then provided by BOM) of lib1 then import also their BOMs directly:

* `com.foo:lib1:$VERSION`
