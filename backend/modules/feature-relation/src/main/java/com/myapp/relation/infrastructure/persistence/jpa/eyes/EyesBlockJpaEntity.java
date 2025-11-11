package com.myapp.relation.infrastructure.persistence.jpa.eyes;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "eyes_blocks",
        indexes = {
                @Index(name = "idx_eyes_block_blocked", columnList = "blocked_persona_id"),
                @Index(name = "idx_eyes_block_blocker", columnList = "blocker_persona_id")
        })
public class EyesBlockJpaEntity {

    @EmbeddedId
    private EyesBlockId id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected EyesBlockJpaEntity() {}
    public EyesBlockJpaEntity(EyesBlockId id, Instant createdAt) {
        this.id = id; this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}