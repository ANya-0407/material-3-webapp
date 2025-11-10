plugins {
    id("org.springframework.boot") version "3.5.7" apply false
    id("io.spring.dependency-management") version "1.1.6" apply false
}

subprojects {
    // 各サブプロジェクトが java 系プラグインを適用した場合のみ共通設定
    plugins.withType(org.gradle.api.plugins.JavaPlugin::class.java) {
        extensions.configure<org.gradle.api.plugins.JavaPluginExtension> {
            toolchain.languageVersion.set(JavaLanguageVersion.of(21))
        }
        tasks.withType<Test>().configureEach { useJUnitPlatform() }
    }
}