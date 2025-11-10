pluginManagement {
    repositories { gradlePluginPortal(); mavenCentral() }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories { mavenCentral() }
}
rootProject.name = "backend"

include(
    "modules:common",
    "modules:feature-auth",
    "modules:feature-user",
    "modules:feature-post",
    "modules:db-migration",
    "modules:api"
)