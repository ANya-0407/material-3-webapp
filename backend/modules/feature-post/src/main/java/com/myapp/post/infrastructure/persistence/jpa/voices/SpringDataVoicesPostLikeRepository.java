package com.myapp.post.infrastructure.persistence.jpa.voices;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataVoicesPostLikeRepository extends JpaRepository<VoicesPostLikeJpaEntity, VoicesPostLikeId> {
    boolean existsById(VoicesPostLikeId id);
    default boolean existsByPostIdAndByPersonaId(UUID postId, UUID byPersonaId) {
        return existsById(new VoicesPostLikeId(postId, byPersonaId));
    }
}