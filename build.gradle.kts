import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar

plugins {
    alias(libs.plugins.sonarqube)
    alias(libs.plugins.johnrengelman.shadow) apply false
    id("application")

}

subprojects {
    apply(plugin = rootProject.libs.plugins.johnrengelman.shadow.get().pluginId)
    apply(plugin = "application")

    repositories {
        mavenCentral()
        gradlePluginPortal()
    }

    java {
        toolchain {
            languageVersion.set(JavaLanguageVersion.of(17))
        }
    }

    tasks.withType<ShadowJar> {
        manifest.attributes["Main-Class"] = application.mainClass
        archiveFileName.set("${project.name}.jar")
        destinationDirectory.set(file("${layout.buildDirectory.get()}/output"))
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