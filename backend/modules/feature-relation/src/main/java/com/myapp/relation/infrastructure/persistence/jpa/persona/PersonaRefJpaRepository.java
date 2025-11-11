package com.myapp.relation.infrastructure.persistence.jpa.persona;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PersonaRefJpaRepository extends JpaRepository<PersonaRefJpaEntity, UUID> {
    Optional<PersonaRefJpaEntity> findByTypeAndPersonaId(String type, String personaId);
}