package com.myapp.auth.domain;

import java.util.Set;
import java.util.UUID;

public record AuthUser(UUID id, String username, Set<String> roles) {}