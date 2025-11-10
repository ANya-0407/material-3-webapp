package com.myapp.post.infrastructure.persistence.jpa.eyes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataEyesPostFriendLinkRepository extends JpaRepository<EyesPostFriendLinkJpaEntity, EyesPostFriendLinkId> {
    List<EyesPostFriendLinkJpaEntity> findByPostIdOrderById_OrdinalAsc(UUID postId);
}