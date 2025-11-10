package com.myapp.auth;

import com.myapp.auth.application.CurrentUserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthModuleConfig {
    @Bean
    public CurrentUserService currentUserService() { return new CurrentUserService(); }
}