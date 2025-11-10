package com.myapp.user.infrastructure.persistence.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataUserJpaRepository extends JpaRepository<UserJpaEntity, UUID> {
    boolean existsByEmail(String email);
    boolean existsByPhoneE164(String phoneE164);
}