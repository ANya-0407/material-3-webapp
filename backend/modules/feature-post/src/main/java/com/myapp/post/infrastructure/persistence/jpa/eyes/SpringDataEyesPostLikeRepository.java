package com.myapp.post.infrastructure.persistence.jpa.eyes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataEyesPostLikeRepository extends JpaRepository<EyesPostLikeJpaEntity, EyesPostLikeId> {
    boolean existsById(EyesPostLikeId id);

    // 便宜メソッド
    default boolean existsByPostIdAndByPersonaId(UUID postId, UUID byPersonaId) {
        return existsById(new EyesPostLikeId(postId, byPersonaId));
    }
}