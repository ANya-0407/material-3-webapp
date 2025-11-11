package com.myapp.relation.infrastructure.persistence.jpa.voices;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "voices_follows",
        indexes = {
                @Index(name = "idx_voices_follow_followee", columnList = "followee_persona_id"),
                @Index(name = "idx_voices_follow_follower", columnList = "follower_persona_id")
        })
public class VoicesFollowJpaEntity {

    @EmbeddedId
    private VoicesFollowId id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected VoicesFollowJpaEntity() {}
    public VoicesFollowJpaEntity(VoicesFollowId id, Instant createdAt) {
        this.id = id; this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}