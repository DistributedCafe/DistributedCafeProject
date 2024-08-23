plugins {
    id("java")
}

dependencies{
    implementation(libs.vertx.core)
    implementation(libs.jackson)
}

repositories {
    mavenCentral()
    mavenLocal()
}