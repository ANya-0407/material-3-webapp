package com.myapp.auth.application;

import com.myapp.auth.domain.AuthUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class CurrentUserService {
    public AuthUser requireCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Jwt jwt)) {
            throw new IllegalStateException("No authenticated JWT in context");
        }
        UUID id = UUID.fromString(jwt.getClaimAsString("sub"));
        String username = jwt.getClaimAsString("preferred_username");
        if (username == null || username.isBlank()) username = id.toString();

        Set<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toUnmodifiableSet());
        return new AuthUser(id, username, roles);
    }
}