import org.gradle.api.tasks.compile.JavaCompile

plugins {
    alias(libs.plugins.sonarqube)
    id("java")
}

allprojects{
    repositories {
        mavenCentral()
    }

    tasks.withType<JavaCompile>  {
        sourceCompatibility = JavaVersion.VERSION_17.toString()
        targetCompatibility = JavaVersion.VERSION_17.toString()
    }
}

sonar {
    properties {
        property("systemProp.sonar.projectKey")
        property("systemProp.sonar.organization")
        property("systemProp.sonar.host.url")
        property("systemProp.sonar.coverage.exclusions")
        property("systemProp.sonar.coverage.jacoco.xmlReportPaths")
        property("systemProp.sonar.exclusions")
        property("systemProp.sonar.javascript.lcov.reportPaths")
        property("systemProp.sonar.sources")
    }
}