plugins {
    id("java")
    alias(libs.plugins.spotless)
}

spotless {
    java {
        googleJavaFormat(libs.versions.google.get())
        formatAnnotations()
    }
}

tasks.javadoc{
    javadocTool.set(javaToolchains.javadocToolFor(java.toolchain))
}
dependencies{
    implementation(libs.vertx.core)
    implementation(libs.jackson)
}

repositories {
    mavenCentral()
    mavenLocal()
}