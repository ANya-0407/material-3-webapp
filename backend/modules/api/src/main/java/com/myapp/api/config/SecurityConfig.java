package com.myapp.api.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.authentication.DefaultBearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final AppDocsProperties docs;
    private final AppJwtProperties jwtProps;

    public SecurityConfig(AppDocsProperties docs, AppJwtProperties jwtProps) {
        this.docs = docs;
        this.jwtProps = jwtProps;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http,
                                            JwtAuthenticationConverter jwtAuthConverter,
                                            BearerTokenResolver bearerTokenResolver) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/v1/auth/register").permitAll();
                    if (docs.isEnabled()) {
                        auth.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll();
                    }
                    auth.requestMatchers("/actuator/health", "/actuator/info").permitAll();
                    auth.anyRequest().authenticated();
                })
                .oauth2ResourceServer(oauth -> oauth
                        .bearerTokenResolver(bearerTokenResolver)
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter))
                )
                .cors(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    BearerTokenResolver bearerTokenResolver() {
        DefaultBearerTokenResolver r = new DefaultBearerTokenResolver();
        r.setAllowFormEncodedBodyParameter(false);
        r.setAllowUriQueryParameter(false);
        return r;
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter gac = new JwtGrantedAuthoritiesConverter();
        gac.setAuthoritiesClaimName(jwtProps.getAuthoritiesClaim());
        gac.setAuthorityPrefix(jwtProps.getAuthorityPrefix());
        JwtAuthenticationConverter conv = new JwtAuthenticationConverter();
        conv.setJwtGrantedAuthoritiesConverter(gac);
        return conv;
    }

    @Bean
    OAuth2TokenValidator<Jwt> commonJwtValidator(AppJwtProperties props) {
        OAuth2TokenValidator<Jwt> base = JwtValidators.createDefault();
        JwtTimestampValidator ts = new JwtTimestampValidator(Duration.ofSeconds(props.getClockSkewSeconds()));
        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(base, ts);

        if (props.getAudience() != null && !props.getAudience().isBlank()) {
            JwtClaimValidator<List<String>> audValidator =
                    new JwtClaimValidator<>("aud", aud -> aud != null && aud.contains(props.getAudience()));
            validator = new DelegatingOAuth2TokenValidator<>(validator, audValidator);
        }
        return validator;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Configuration
    @ConditionalOnProperty(prefix = "app.jwt", name = "mode", havingValue = "LOCAL", matchIfMissing = true)
    static class LocalJwtDecoderConfig {
        @Bean
        JwtDecoder jwtDecoder(AppJwtProperties props, OAuth2TokenValidator<Jwt> commonValidator) {
            SecretKey key = new SecretKeySpec(props.getSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(key)
                    .macAlgorithm(MacAlgorithm.HS256)
                    .build();
            decoder.setJwtValidator(commonValidator);
            return decoder;
        }
    }

    @Configuration
    @ConditionalOnProperty(prefix = "app.jwt", name = "mode", havingValue = "REMOTE")
    static class RemoteJwtDecoderConfig {
        @Bean
        JwtDecoder jwtDecoder(AppJwtProperties props, OAuth2TokenValidator<Jwt> commonValidator) {
            NimbusJwtDecoder decoder = (NimbusJwtDecoder) JwtDecoders.fromIssuerLocation(props.getIssuerUri());
            OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(props.getIssuerUri());
            OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(withIssuer, commonValidator);
            decoder.setJwtValidator(validator);
            return decoder;
        }
    }
}