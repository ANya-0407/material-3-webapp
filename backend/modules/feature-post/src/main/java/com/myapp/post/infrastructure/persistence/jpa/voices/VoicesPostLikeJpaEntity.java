package com.myapp.post.infrastructure.persistence.jpa.voices;

import jakarta.persistence.*;

@Entity
@Table(name = "voices_post_likes")
public class VoicesPostLikeJpaEntity {
    @EmbeddedId
    private VoicesPostLikeId id;

    protected VoicesPostLikeJpaEntity() {}
    public VoicesPostLikeJpaEntity(VoicesPostLikeId id) { this.id = id; }
}