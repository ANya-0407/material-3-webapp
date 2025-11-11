package com.myapp.relation.infrastructure.persistence.jpa.voices;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "voices_blocks",
        indexes = {
                @Index(name = "idx_voices_block_blocked", columnList = "blocked_persona_id"),
                @Index(name = "idx_voices_block_blocker", columnList = "blocker_persona_id")
        })
public class VoicesBlockJpaEntity {

    @EmbeddedId
    private VoicesBlockId id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected VoicesBlockJpaEntity() {}
    public VoicesBlockJpaEntity(VoicesBlockId id, Instant createdAt) {
        this.id = id; this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}