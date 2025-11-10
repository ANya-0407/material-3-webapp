plugins { `java-library` }

dependencies {
    implementation(platform("org.springframework.boot:spring-boot-dependencies:3.5.7"))
    implementation(project(":modules:common"))

    // 実体は api が提供。ここでは“型”だけ参照
    compileOnly("org.springframework.security:spring-security-core")
    compileOnly("org.springframework.security:spring-security-oauth2-jose")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    // ArchUnit
    testImplementation("com.tngtech.archunit:archunit-junit5:1.3.0")
}