package com.myapp.post.infrastructure.persistence.jpa.eyes;

import jakarta.persistence.*;

@Entity
@Table(name = "eyes_post_likes")
public class EyesPostLikeJpaEntity {
    @EmbeddedId
    private EyesPostLikeId id;

    protected EyesPostLikeJpaEntity() {}
    public EyesPostLikeJpaEntity(EyesPostLikeId id) { this.id = id; }
}