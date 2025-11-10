package com.myapp.post.infrastructure.persistence.jpa.eyes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataEyesPostJpaRepository extends JpaRepository<EyesPostJpaEntity, UUID> { }