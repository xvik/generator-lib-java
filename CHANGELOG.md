* Update gradle 4.6 -> 4.8.1
* Update et.researchgate.release 2.6.0 -> 2.7.0
* Update com.jfrog.bintray 1.8.0 -> 1.8.4
* Update com.github.ben-manes.versions 0.17.0 -> 0.20.0
* Update ru.vyarus.java-lib 1.0.5 -> 1.1.2
* Update ru.vyarus.quality 3.0.0 -> 3.1.1

### 2.5.0 (2018-04-02)
* Update gradle 4.1 -> 4.6
* Update gradle-quality-plugin 2.3.0 -> 3.0.0
* Update gradle-animalsniffer-plugin 1.4.1 -> 1.4.3
* Update gradle-bintray-plugin 1.7.3 -> 1.8.0
* Update gradle-versions-plugin 0.15.0 -> 0.17.0
* Use spotbugs-annotations dependency instead of jsr305
* Add windows build via [appveyor](https://www.appveyor.com/) 
    - New file .appveyor.yml
    - Coverage uploaded to codecov (with windows flag)
* Update travis config: coverage sent to [codecov](https://codecov.io/) (with linux tag)
* Remove coveralls plugin (switch from coveralls to codecov because it could merge coverages from different platforms)    
* Update README:
    - Add appveyor and codecov badges (instead of coveralls)    
    - Replace jcenter badge from shields to bintray native badge (because shields bintray support not working)

### 2.4.0 (2017-08-19)
* Update gradle 3.3 -> 4.1
* Update gradle-release-plugin 2.5.0 -> 2.6.0
* Update gradle-quality-plugin 2.1.0 -> 2.3.0
* Update gradle-animalsniffer-plugin 1.2.0 -> 1.4.1
* Update gradle-versions-plugin 0.13.0 -> 0.15.0
* Update gradle-java-lib-plugin 1.0.4 -> 1.0.5
* Update coveralls-gradle-plugin 2.7.1 -> 2.8.1
* Update spock to 1.0 -> 1.1
* Update travis config: 
    - increase check task timeout to 20 min
    - disable gradle daemon ([recommended](https://docs.gradle.org/4.0.1/userguide/gradle_daemon.html#when_should_i_not_use_the_gradle_daemon))
    - remove TERM=dump (set automatically by travis)
    - update cache management  

### 2.3.0 (2017-01-24)
* Yeoman generator 1.0 compatibility
* Update gradle 3.0 -> 3.3
* Update gradle-bintray-plugin 1.7.1 -> 1.7.3
* Update gradle-release-plugin 2.4.1 -> 2.5.0
* Update coveralls-gradle-plugin 2.6.3 -> 2.7.1
* Update gradle-quality-plugin 2.0.0 -> 2.1.0
* Fix report path in showDependenciesTree task and remove deprecated left shift syntax

### 2.2.0 (2016-09-09)
* Update gradle 2.12 -> 3.0
* Update gradle-java-lib-plugin 1.0.1 -> 1.0.4
* Update gradle-animalsniffer-plugin 1.0.1 -> 1.2.0
* Update gradle-quality-plugin 1.3.0 -> 2.0.0
* Update gradle-bintray-plugin 1.6 -> 1.7.1
* Update gradle-versions-plugin 0.12.0 -> 0.13.0
* Update gradle-release-plugin 2.3.5 -> 2.4.1  
* Update mode:
  - now able to overwrite travis,yml, .gitignore and gradle script files 
  - fix maven central sync logic

### 2.1.0 (2016-04-15)
* Update gradle-versions-plugin 0.11.3 -> 0.12.0
* Update coveralls-gradle-plugin 2.4.0x -> 2.6.3
* Update gradle-bintray-plugin 1.5 -> 1.6
* Update gradle-release-plugin 2.3.4 -> 2.3.5
* Update gradle-quality-plugin 1.2.0 -> 1.3.0
* Update gradle-animalsniffer-plugin 1.0.0 -> 1.0.1
* Update gradle-github-info-plugin 1.0.0 -> 1.1.0
    - New plugin will [specify github repo and changelog file](https://github.com/xvik/gradle-github-info-plugin#comjfrogbintray) 
    (if recognize) for bintray package (useful for package creation)
* Improve travis cache configuration (according to [travis guide](https://docs.travis-ci.com/user/languages/java/#Caching))
* Update gradle 2.10 -> 2.12 
* Animalsniffer signatures:
    - Replace java16-sun to java16
    - Replace whildcard versions (`+`) to actual latest signature versions

### 2.0.0 (2016-01-07)
* Build logic extracted to gradle plugins. As a result, only one small build file required now:
    - removed build-deps.gradle
    - removed all geadle files inside gradle/ folder
* Quality tools configs (gradle/config) removed: they are maintained by gradle quality plugin
* Update gradle 2.8 -> 2.10     

### 1.1.4 (2015-10-27)
* Change maven badge from maven-badges.herokuapp.com to shields.io (but link still leads to maven-badges.herokuapp.com) 
* Change bintray badge to shields.io badge (for custom label)
* Update gradle 2.6 -> 2.8
* Update checkstyle 6.9 -> 6.11.2
    - compatibility.jar is not required anymore and must be removed from gradle/config/checkstyle/compatibility.jar
* Update pmd 5.3.3 -> 5.4.0
* Update gradle-bintray-plugin 1.3.1 -> 1.4
* Update gradle-release 2.2.0 -> 2.3.0    

### 1.1.3 (2015-08-13)
* Update gradle 2.5 -> 2.6
* Update checkstyle 6.8.1 -> 6.9
* Update gradle-bintray-plugin 1.2 -> 1.3.1
* Update gradle-release plugin 2.1.2 -> 2.2.0
* Update .travis.yml to use [container infrastructure](http://docs.travis-ci.com/user/migrating-from-legacy) and enable cache for gradle dependencies

### 1.1.2 (2015-07-29)
* Fix java 7 build compatibility

### 1.1.1 (2015-07-29)
* Update gradle 2.4 -> 2.5
* Update checkstyle 6.7 -> 6.8.1 (with compatibility fix)
* Update pmd 5.3.2 -> 5.3.3

### 1.1.0 (2015-06-27)
* Update coveralls-gradle-plugin 2.3.1 -> 2.4.0
* Update gradle-versions-plugin 0.9 -> 0.11.3
* Update gradle-release 2.0.2 -> 2.1.2
* Update checkstyle 6.5 -> 6.7
* Update pmd 5.2.3 -> 5.3.2
* Add strictQualityCheck option to build.gradle to be able to disable build fail on quality plugin warnings
* Remove anonymous analytics
* Add snapshots section to readme: describes how to use JitPack 

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