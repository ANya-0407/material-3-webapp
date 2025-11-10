package com.myapp.user;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition;

@AnalyzeClasses(packages = "com.myapp.user")
public class ArchitectureTest {

    // user: domain は infra/web/Spring/JPA に依存しない
    @ArchTest
    static final var domainIsPure = ArchRuleDefinition.noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat()
            .resideInAnyPackage("..web..", "..infrastructure..", "org.springframework..", "jakarta.persistence..");

    // user -> auth への直接依存を禁止
    @ArchTest
    static final var noFeatureToFeature = ArchRuleDefinition.noClasses()
            .that().resideInAnyPackage("com.myapp.user..")
            .should().dependOnClassesThat().resideInAnyPackage("com.myapp.auth..");
}