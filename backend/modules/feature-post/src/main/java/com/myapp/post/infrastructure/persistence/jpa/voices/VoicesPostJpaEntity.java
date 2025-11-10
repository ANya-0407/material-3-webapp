package com.myapp.post.infrastructure.persistence.jpa.voices;

import com.myapp.post.domain.VoicesPost;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "voices_posts",
        indexes = {
                @Index(name = "idx_voices_posts_owner_created", columnList = "owner_persona_id,created_at"),
                @Index(name = "idx_voices_posts_created", columnList = "created_at"),
                @Index(name = "idx_voices_posts_good_count", columnList = "good_count")
        })
public class VoicesPostJpaEntity {

    @Id
    @Column(nullable = false)
    private UUID id;

    @Column(name = "owner_persona_id", nullable = false)
    private UUID ownerPersonaId;

    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(name = "hashtag", length = 100)
    private String hashtag;

    @Column(name = "view_count", nullable = false)
    private long viewCount;

    @Column(name = "good_count", nullable = false)
    private long goodCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected VoicesPostJpaEntity() {}

    public VoicesPostJpaEntity(UUID id, UUID ownerPersonaId, String text, String hashtag,
                               long viewCount, long goodCount, Instant createdAt, Instant updatedAt) {
        this.id = id; this.ownerPersonaId = ownerPersonaId; this.text = text; this.hashtag = hashtag;
        this.viewCount = viewCount; this.goodCount = goodCount; this.createdAt = createdAt; this.updatedAt = updatedAt;
    }

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = Instant.now(); }
}