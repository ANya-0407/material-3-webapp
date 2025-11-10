package com.myapp.auth;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition;

@AnalyzeClasses(packages = "com.myapp.auth")
public class ArchitectureTest {

    // auth: domain は Spring/JPA/web に依存しない
    @ArchTest
    static final var domainIsPure = ArchRuleDefinition.noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat()
            .resideInAnyPackage("..web..", "..infrastructure..", "org.springframework..", "jakarta.persistence..");

    // auth -> user への直接依存を禁止
    @ArchTest
    static final var noFeatureToFeature = ArchRuleDefinition.noClasses()
            .that().resideInAnyPackage("com.myapp.auth..")
            .should().dependOnClassesThat().resideInAnyPackage("com.myapp.user..");
}