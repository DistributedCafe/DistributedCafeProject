plugins {
    alias(libs.plugins.spotless)
}


spotless {
    java {
        googleJavaFormat()
        formatAnnotations()
    }
}

application {
    mainClass.set("application.Main")
}

dependencies{
    implementation(libs.vertx.core)
    implementation(libs.jackson)
}