package com.myapp.relation.infrastructure.persistence.jpa.eyes;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.UUID;

public interface SpringDataEyesBlockRepository extends JpaRepository<EyesBlockJpaEntity, EyesBlockId> {

    default boolean existsEitherDirection(UUID a, UUID b) {
        return existsById(new EyesBlockId(a, b)) || existsById(new EyesBlockId(b, a));
    }

    default boolean existsAT(UUID a, UUID b) { return existsById(new EyesBlockId(a, b)); }
    default boolean existsTA(UUID a, UUID b) { return existsById(new EyesBlockId(b, a)); }

    default void upsert(UUID blocker, UUID blocked) {
        try {
            save(new EyesBlockJpaEntity(new EyesBlockId(blocker, blocked), Instant.now()));
        } catch (DataIntegrityViolationException ignore) {
            // 冪等
        }
    }

    default void deletePair(UUID blocker, UUID blocked) {
        deleteById(new EyesBlockId(blocker, blocked));
    }
}