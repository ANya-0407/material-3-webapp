package com.myapp.user.infrastructure.persistence.jpa;

import com.myapp.user.domain.PersonaType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpringDataPersonaJpaRepository extends JpaRepository<PersonaJpaEntity, UUID> {
    boolean existsByTypeAndPersonaIdNorm(PersonaType type, String personaIdNorm);
    Optional<PersonaJpaEntity> findByTypeAndPersonaId(PersonaType type, String personaId);
}