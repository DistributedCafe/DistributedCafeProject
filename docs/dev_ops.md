---
title: DevOps
layout: default
nav_order: 8
---
# DevOps

## Workflow organization
We chose to use git, and github in particular, to version our project.  
### Branch management
* **Branch "main"**: branch where the final version of the code is stored. The semantic release starts when the code is pushed here.
* **Branch "develop"**: branch that stores the code during the development of a new version of the project. Each new feature, fix, refactoring process etc. is developed in its own branch made from develop.
* **Branch "report"**: branch where all the documentation is stored. It contains the report published in the github pages and also the documentation of the code automatically generated.

### Branch protection rules
We decided to use branch protections rules in *main* and *develop* branches.  
In order to push there is required to make a *pull request* from another branch. It is necessary that all the commits made in the new branch are signed and that one of the owners of the repository makes a review of the new code. 
Thanks to github actions, we also implemented *status checks* that are required to pass before merging.

### Commits
We followed the good practice of signing our commits and we also required everybody doing a pull request to do so, otherwise the pull request will be rejected automatically.  

In addiction, we used also conventional commits to enable semantic release based on them. We check their correct usage thanks to Gradle plugin applied as *pre commits git hooks*.

### API documentation
We used *Swagger* to publish both the web socket documentation, required for the app development, and the API documentation, required for server development. This way we can easily consult them.

The API documentation is available here: 
* *REST API*: [DistributedCafe API documentation](https://app.swaggerhub.com/apis/ElisaAlbertini/DistributedCafe/1.0.1)
* *WebSocket*: [DistributedCafe WebSocket documentation](https://app.swaggerhub.com/apis/ElisaAlbertini/WebSocketDistributedCafe/1.0.1)

### Pull request template
We decided to add a template for pull requests as a guideline. It is useful for the team and other developers, since our project is distributed under a MIT license.

## Build automation
### Multiproject structure
The project contains subprojects running on different platforms (JVM and Node.js). All the JVM subprojects are managed with *Gradle* while the others are managed with *npm*.

### Gradle
The Gradle version chosen for the project is 8.7.  
The main project has a general configuration valid for all the subprojects. Each of them has also their own build file.  

In order to collect and bundle dependencies we organized them with a catalog.

We defined a custom task to generate the shadowJar of the components using the JVM. To achieve this, we used a Gradle plugin called *[com.gradleup.shadow](https://plugins.gradle.org/plugin/com.gradleup.shadow)*. This plugin allows the generation of an executable JAR by configuring the main class of the project, the name of the JAR, and the destination directory.

### Npm
Each Node.js subproject uses npm to manage useful scripts and project information. Thanks to it we managed also the production and development dependencies. In fact, the package manager allows to specify in which group the libraries must stay. This, combined with the build script, generates a clear development/production version of the project. 

### webpack
To generate the production version of the Node.js back-ends, we used *Webpack* which is a npm package for transforming, bundling, or packaging resources or assets.

## Code quality control
### Code formatting
Each component of the project has a specific formatting tool to format and check the code.  

We used *Spotless* to manage the formatting with Gradle, and in particular we used *Ktlint* for the Kotlin code and *Google Java Format* with *aosp* style for the Java code. 

As for Typescript code we used *typescript-formatter*, an *npm* package.

### Code quality and security
In order to check code quality and security we decide to use a Gradle plugin called *SonarCloud* which is a cloud-based service that provides code analysis. Thanks to the Gradle properties we set up the tool in a way it analyzes all the subprojects. We also specify different parameters such as which files need to be included in the coverage analysis.
It also highlights code duplication, possible issues and security hotspots in the code. Developers have to follow the hints given by tool.  
The coverage must be &ge; 80% and the code duplication must be &le; 3% to pass successfully an analysis.

### Coverage
To generate the coverage report for each back-end component we used *JaCoCo* and *Jest*.

## CI - github actions 

### Reusable actions
We decided to create two reusable actions to avoid repetition. One is meant to start the tests of *server* and one is meant to initialize the actions when a component needs to be tested.

### Testing
Each backend component has a workflow that runs their Unit tests and Jest tests. It uses a github action called *[mongodb-github-action](https://github.com/supercharge/mongodb-github-action)* to create the db. They are used inside the main pipeline for pull requests to check if the tests are successful.  

In order to test the server we need to start all the microservices and the server.

### Documentation
There is a specific workflow that generates and deploys documentation each time a push is made on the *develop* and *main* branch.  
It's been used:
* *Typedoc* to generate documentation for TypeScript
* *Dokka* to generate documentation for Kotlin
* *Javadoc* to generate documentation for Java  

In order to publish all the documentation at once, the task merges all of them together and deploys it in the *report* branch thank to a github action called *[github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action)*.

The code documentation is available here:

* **Back-end documentation**

    * *WarehouseService*: [WarehouseService documentation](./dokka/index.html)
    * *Menu Service*: [Menu Service documentation](./typedoc/menu-service/index.html)
    * *Orders Service*: [Orders Service documentation](./typedoc/orders-service/index.html)
    * *Server*: [Server documentation](./typedoc/server/index.html)
* **Front-end documentation**
    * *Manager application*: [Manager application documentation](./typedoc/manager-application/index.html)
    * *Customer application*: [Customer application documentation](./typedoc/customer-application/index.html)
    * *Employee application*: [Employee application documentation](./javadoc/index.html)

### Code formatting
When a new pull request is created, it triggers tasks to check the code formatting. If any checker finds improperly formatted code, the action fails.

### SonarCloud
SonarCloud analysis is triggered when a push or a pull request is made on *develop* or *main* branch.  
First, it generates the coverage report for all the back-end components. Then, in order to generate an unified *lcov* file, it merges the *Jest* reports, thanks to *[nyc](https://www.npmjs.com/package/nyc)* npm package.  
Additionally, SonarCloud provides a *github app* which enables an inline report of the pull request analysis.

### Semantic release
We decided to rely on semantic release to generate version tags based on the information provided by conventional commit messages.  
When a push is made on the *main* branch, it triggers the semantic release pipeline. It sets up the environment and creates the WarehouseService and EmployeeApplication jars, the assets. Lastly, it does the release calling the npm package *semantic-release* given the GH_TOKEN that allows to push on a protected branch.  
We preconfigured the semantic release thanks to the npm plugin *[semantic-release-preconfigured-conventional-commits](https://www.npmjs.com/package/semantic-release-conventional-commits)* that requires a configuration file (*release.config.js*) in which we specified the assets and the plugins.

### Repository secrets
We stored the sensible information required by the github actions thanks to *Repository secrets*.  
In particular we create the following secrets:
* *SONAR_TOKEN* to enable SonarCloud analysis
* *DOCKER_USERNAME & DOCKER_PASSWORD* to enable the publication of the docker images
* *GH_TOKEN* to enable semantic release on protected branches

## CD
### Docker Hub
When a new version is released it triggers the docker pipeline. It publishes, on a *Docker Hub* repository, the docker images of all the components of the system, except EmployeeApplication.  
Thanks to this operation it's always possible to pull the latest version of the images.

### Github pages
Our GitHub Pages site is currently built from the */docs* folder in the *report* branch. It publishes the documentation of our project, composed by the code documentation and the project report.