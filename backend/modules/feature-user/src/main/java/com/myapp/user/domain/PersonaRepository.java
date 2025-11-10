package com.myapp.user.domain;

import java.util.Optional;
import java.util.UUID;

public interface PersonaRepository {
    boolean existsByTypeAndPersonaIdNormalized(PersonaType type, String personaIdNormalized);
    Persona save(Persona persona);
    Optional<Persona> findByTypeAndPersonaId(PersonaType type, String personaId);
}