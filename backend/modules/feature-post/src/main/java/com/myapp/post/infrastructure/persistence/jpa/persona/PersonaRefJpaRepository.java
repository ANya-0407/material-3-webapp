package com.myapp.post.infrastructure.persistence.jpa.persona;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PersonaRefJpaRepository extends JpaRepository<PersonaRefJpaEntity, UUID> { }