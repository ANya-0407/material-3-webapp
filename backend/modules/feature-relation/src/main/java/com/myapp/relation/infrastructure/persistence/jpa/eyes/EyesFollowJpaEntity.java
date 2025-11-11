package com.myapp.relation.infrastructure.persistence.jpa.eyes;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "eyes_follows",
        indexes = {
                @Index(name = "idx_eyes_follow_followee", columnList = "followee_persona_id"),
                @Index(name = "idx_eyes_follow_follower", columnList = "follower_persona_id")
        })
public class EyesFollowJpaEntity {

    @EmbeddedId
    private EyesFollowId id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected EyesFollowJpaEntity() {}
    public EyesFollowJpaEntity(EyesFollowId id, Instant createdAt) {
        this.id = id; this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}