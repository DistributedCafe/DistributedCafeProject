plugins {
    id("org.sonarqube") version "4.4.1.3373"
}

sonar {
    properties {
        property("sonar.projectKey", "DistributedCafe_DistributedCafeProject")
        property("sonar.organization", "distributedcafe")
        property("sonar.host.url", "https://sonarcloud.io")
    }
}