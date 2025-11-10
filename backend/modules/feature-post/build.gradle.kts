plugins { `java-library` }

dependencies {
    implementation(platform("org.springframework.boot:spring-boot-dependencies:3.5.7"))
    implementation(project(":modules:common"))

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    // Security は Web 層で Jwt を受け取るのみ（crypto 無し）

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("com.tngtech.archunit:archunit-junit5:1.3.0")
}