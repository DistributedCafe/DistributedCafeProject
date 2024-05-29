plugins {
    alias(libs.plugins.kotlin)
    alias(libs.plugins.dokka)
    alias(libs.plugins.ktlint)
    kotlin("plugin.serialization") version "1.9.24"
    id("jacoco")
}

jacoco {
    toolVersion = libs.versions.jacoco.get()
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(libs.bundles.kotlin.testing)
    testImplementation(libs.bundles.cucumber.testing)
    testImplementation(libs.junit.vintage)
    implementation(libs.bundles.vertx)
    implementation(libs.mongodb.driver)
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
}

tasks.test {
    useJUnitPlatform()
    finalizedBy(tasks.jacocoTestReport)
}

tasks.jacocoTestReport {
    dependsOn(tasks.test)
    reports {
        xml.required.set(true)
        csv.required.set(true)
    }
}

ktlint {
    filter {
        include("**/main/kotlin/**/*.kt")
        exclude("**/*.gradle.kts")
    }
}

