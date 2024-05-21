plugins {
    alias(libs.plugins.kotlin)
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(libs.bundles.kotlin.testing)
}

tasks.test {
    useJUnitPlatform()
}