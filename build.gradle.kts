plugins {
    id("org.sonarqube") version "4.4.1.3373"
}

sonar {
    properties {
        property("systemProp.sonar.projectKey")
        property("systemProp.sonar.organization")
        property("systemProp.sonar.host.url")
    }
}