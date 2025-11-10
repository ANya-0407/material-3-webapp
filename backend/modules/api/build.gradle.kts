plugins {
    id("org.springframework.boot")
    id("io.spring.dependency-management")
    id("java")
}
dependencies {
    implementation(project(":modules:common"))
    implementation(project(":modules:feature-auth"))
    implementation(project(":modules:feature-user"))
    implementation(project(":modules:feature-post"))  // ★ 追加

    runtimeOnly(project(":modules:db-migration"))

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.11")
    implementation("org.flywaydb:flyway-core")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}