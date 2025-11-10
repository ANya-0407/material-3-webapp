package com.myapp.post.infrastructure.persistence.jpa.voices;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataVoicesPostImageRepository extends JpaRepository<VoicesPostImageJpaEntity, VoicesPostImageId> {
    List<VoicesPostImageJpaEntity> findById_PostIdOrderById_OrdinalAsc(UUID postId);
}