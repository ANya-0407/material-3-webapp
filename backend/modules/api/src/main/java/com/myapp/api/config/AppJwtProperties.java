package com.myapp.api.config;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public class AppJwtProperties {
    public enum Mode { LOCAL, REMOTE } // LOCAL=HS256, REMOTE=Issuer/JWKS

    private Mode mode = Mode.LOCAL;
    private String secret;             // LOCAL 用
    private String issuerUri;          // REMOTE 用
    private String audience;           // aud 検証
    private String authoritiesClaim = "scope"; // 権限クレーム名
    private String authorityPrefix = "SCOPE_"; // 付与するプレフィックス
    private long clockSkewSeconds = 60;        // exp/nbf 許容スキュー

    @PostConstruct
    void validate() {
        if (mode == Mode.LOCAL && (secret == null || secret.isBlank()))
            throw new IllegalStateException("app.jwt.secret must be set when app.jwt.mode=LOCAL");
        if (mode == Mode.REMOTE && (issuerUri == null || issuerUri.isBlank()))
            throw new IllegalStateException("spring.security.oauth2.resourceserver.jwt.issuer-uri must be set when app.jwt.mode=REMOTE");
    }
    // getters/setters
    public Mode getMode() { return mode; } public void setMode(Mode mode) { this.mode = mode; }
    public String getSecret() { return secret; } public void setSecret(String secret) { this.secret = secret; }
    public String getIssuerUri() { return issuerUri; } public void setIssuerUri(String issuerUri) { this.issuerUri = issuerUri; }
    public String getAudience() { return audience; } public void setAudience(String audience) { this.audience = audience; }
    public String getAuthoritiesClaim() { return authoritiesClaim; } public void setAuthoritiesClaim(String authoritiesClaim) { this.authoritiesClaim = authoritiesClaim; }
    public String getAuthorityPrefix() { return authorityPrefix; } public void setAuthorityPrefix(String authorityPrefix) { this.authorityPrefix = authorityPrefix; }
    public long getClockSkewSeconds() { return clockSkewSeconds; } public void setClockSkewSeconds(long clockSkewSeconds) { this.clockSkewSeconds = clockSkewSeconds; }
}