package com.myapp.post.infrastructure.persistence.jpa.eyes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataEyesPostBookmarkRepository extends JpaRepository<EyesPostBookmarkJpaEntity, EyesPostBookmarkId> {
    boolean existsById(EyesPostBookmarkId id);
    default boolean existsByPostIdAndByPersonaId(UUID postId, UUID byPersonaId) {
        return existsById(new EyesPostBookmarkId(postId, byPersonaId));
    }
}