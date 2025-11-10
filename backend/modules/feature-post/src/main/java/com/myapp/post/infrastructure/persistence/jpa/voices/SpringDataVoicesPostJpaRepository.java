package com.myapp.post.infrastructure.persistence.jpa.voices;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataVoicesPostJpaRepository extends JpaRepository<VoicesPostJpaEntity, UUID> { }