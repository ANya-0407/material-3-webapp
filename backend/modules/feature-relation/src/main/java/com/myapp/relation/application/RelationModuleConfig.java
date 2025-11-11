package com.myapp.relation.application;

import com.myapp.relation.domain.EyesRelationRepository;
import com.myapp.relation.domain.VoicesRelationRepository;
import com.myapp.relation.infrastructure.persistence.jpa.persona.PersonaRefJpaRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RelationModuleConfig {

    @Bean
    public EyesRelationService eyesRelationService(PersonaRefJpaRepository personaRepo,
                                                   EyesRelationRepository eyesRepo) {
        return new EyesRelationService(personaRepo, eyesRepo);
    }

    @Bean
    public VoicesRelationService voicesRelationService(PersonaRefJpaRepository personaRepo,
                                                       VoicesRelationRepository voicesRepo) {
        return new VoicesRelationService(personaRepo, voicesRepo);
    }
}