package com.myapp.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.docs")
public class AppDocsProperties {
    private boolean enabled = false; // 本番は既定で非公開
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}