package com.myapp.relation.infrastructure.persistence.jpa.eyes;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.UUID;

public interface SpringDataEyesFollowRepository extends JpaRepository<EyesFollowJpaEntity, EyesFollowId> {

    default boolean existsPair(UUID follower, UUID followee) {
        return existsById(new EyesFollowId(follower, followee));
    }

    default void upsert(UUID follower, UUID followee) {
        try {
            save(new EyesFollowJpaEntity(new EyesFollowId(follower, followee), Instant.now()));
        } catch (DataIntegrityViolationException ignore) {
            // 冪等: 既存なら何もせず
        }
    }

    default void deletePair(UUID follower, UUID followee) {
        deleteById(new EyesFollowId(follower, followee));
    }

    default void deleteBoth(UUID a, UUID b) {
        deletePair(a, b);
        deletePair(b, a);
    }
}