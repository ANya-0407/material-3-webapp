package com.myapp.post.infrastructure.persistence.jpa.voices;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataVoicesPostBookmarkRepository extends JpaRepository<VoicesPostBookmarkJpaEntity, VoicesPostBookmarkId> {
    boolean existsById(VoicesPostBookmarkId id);
    default boolean existsByPostIdAndByPersonaId(UUID postId, UUID byPersonaId) {
        return existsById(new VoicesPostBookmarkId(postId, byPersonaId));
    }
}