package com.myapp.relation.infrastructure.persistence.jpa.voices;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.UUID;

public interface SpringDataVoicesFollowRepository extends JpaRepository<VoicesFollowJpaEntity, VoicesFollowId> {

    default boolean existsPair(UUID follower, UUID followee) {
        return existsById(new VoicesFollowId(follower, followee));
    }

    default void upsert(UUID follower, UUID followee) {
        try {
            save(new VoicesFollowJpaEntity(new VoicesFollowId(follower, followee), Instant.now()));
        } catch (DataIntegrityViolationException ignore) {
            // 冪等
        }
    }

    default void deletePair(UUID follower, UUID followee) {
        deleteById(new VoicesFollowId(follower, followee));
    }

    default void deleteBoth(UUID a, UUID b) {
        deletePair(a, b);
        deletePair(b, a);
    }
}