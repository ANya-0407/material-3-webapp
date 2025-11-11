package com.myapp.relation.infrastructure.persistence.jpa.voices;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.UUID;

public interface SpringDataVoicesBlockRepository extends JpaRepository<VoicesBlockJpaEntity, VoicesBlockId> {

    default boolean existsEitherDirection(UUID a, UUID b) {
        return existsById(new VoicesBlockId(a, b)) || existsById(new VoicesBlockId(b, a));
    }

    default boolean existsAT(UUID a, UUID b) { return existsById(new VoicesBlockId(a, b)); }
    default boolean existsTA(UUID a, UUID b) { return existsById(new VoicesBlockId(b, a)); }

    default void upsert(UUID blocker, UUID blocked) {
        try {
            save(new VoicesBlockJpaEntity(new VoicesBlockId(blocker, blocked), Instant.now()));
        } catch (DataIntegrityViolationException ignore) {
            // 冪等
        }
    }

    default void deletePair(UUID blocker, UUID blocked) {
        deleteById(new VoicesBlockId(blocker, blocked));
    }
}