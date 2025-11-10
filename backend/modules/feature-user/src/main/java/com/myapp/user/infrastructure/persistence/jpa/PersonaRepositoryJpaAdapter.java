package com.myapp.user.infrastructure.persistence.jpa;

import com.myapp.user.domain.Persona;
import com.myapp.user.domain.PersonaRepository;
import com.myapp.user.domain.PersonaType;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class PersonaRepositoryJpaAdapter implements PersonaRepository {

    private final SpringDataPersonaJpaRepository jpa;

    public PersonaRepositoryJpaAdapter(SpringDataPersonaJpaRepository jpa) { this.jpa = jpa; }

    @Override
    public boolean existsByTypeAndPersonaIdNormalized(PersonaType type, String personaIdNormalized) {
        return jpa.existsByTypeAndPersonaIdNorm(type, personaIdNormalized);
    }

    @Override
    public Persona save(Persona persona) {
        return PersonaJpaEntity.toDomain(jpa.save(PersonaJpaEntity.fromDomain(persona)));
    }

    @Override
    public Optional<Persona> findByTypeAndPersonaId(PersonaType type, String personaId) {
        return jpa.findByTypeAndPersonaId(type, personaId).map(PersonaJpaEntity::toDomain);
    }
}