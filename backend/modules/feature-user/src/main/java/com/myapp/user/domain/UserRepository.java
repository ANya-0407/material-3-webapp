package com.myapp.user.domain;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    Optional<User> findById(UUID id);
    boolean existsByEmail(String normalizedEmail);
    boolean existsByPhone(String phoneE164);
    User save(User user);
}