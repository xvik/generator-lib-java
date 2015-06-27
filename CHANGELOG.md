* Update coveralls-gradle-plugin 2.3.1 -> 2.4.0
* Update gradle-versions-plugin 0.9 -> 0.11.3
* Update gradle-release 2.0.2 -> 2.1.2
* Update checkstyle 6.5 -> 6.7
* Update pmd 5.2.3 -> 5.3.2
* Add strictQualityCheck option to build.gradle to be able to disable build fail on quality plugin warnings
* Remove anonymous analytics

### 1.0.4 (2015-05-07)
* Update gradle 2.3 -> 2.4
* Update gradle-bintray-plugin 1.1 -> 1.2
* Update gradle-versions-plugin 0.8 -> 0.9
* Remove explicit pmd dependencies because gradle now supports pmd 5.2 and above (not updated to 5.3.1 because of regression https://sourceforge.net/p/pmd/bugs/1331/)
* Update checkstyle 6.4.1 -> 6.5 (not updated to 6.6 because it fails with NPE sometimes)
* Switch gradle-release-plugin from com.github.townsfolk:gradle-release to net.researchgate:gradle-release (old plugin abandoned and this one is the new version)
* Removed checkOutOfDate task: use dependencyUpdates task instead (provided by version plugin)
* Apply correct groups for custom tasks

### 1.0.3 (2015-03-12)
* Update spock 0.7 -> 1.0
* Update findbugs 3.0.0 -> 3.0.1
* Update checkstyle 6.3 - > 6.4.1

### 1.0.2 (2015-02-23)
* Update gradle 2.2.1 -> 2.3
* Update gradle-versions-plugin 0.7 -> 0.8

### 1.0.1 (2015-02-12)
* Update gradle-bintray-plugin 1.0 -> 1.1
* Update coveralls-gradle-plugin 2.1.0 -> 2.3.1
* Update checkstyle 6.2 -> 6.3

### 1.0.0 (2015-01-21)
* initial release (converted [slush generator](https://github.com/xvik/slush-lib-java))