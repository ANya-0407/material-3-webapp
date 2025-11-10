package com.myapp.post.infrastructure.persistence.jpa.eyes;

import com.myapp.post.domain.EyesPost;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "eyes_posts",
        indexes = {
                @Index(name = "idx_eyes_posts_owner_created", columnList = "owner_persona_id,created_at"),
                @Index(name = "idx_eyes_posts_created", columnList = "created_at"),
                @Index(name = "idx_eyes_posts_good_count", columnList = "good_count")
        })
public class EyesPostJpaEntity {

    @Id
    @Column(nullable = false)
    private UUID id;

    @Column(name = "owner_persona_id", nullable = false)
    private UUID ownerPersonaId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(length = 50)
    private String tag;

    @Column(length = 100)
    private String hashtag;

    @Column(name = "view_count", nullable = false)
    private long viewCount;

    @Column(name = "good_count", nullable = false)
    private long goodCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected EyesPostJpaEntity() {}

    public EyesPostJpaEntity(UUID id, UUID ownerPersonaId, String imageUrl, String tag, String hashtag,
                             long viewCount, long goodCount, Instant createdAt, Instant updatedAt) {
        this.id = id; this.ownerPersonaId = ownerPersonaId; this.imageUrl = imageUrl;
        this.tag = tag; this.hashtag = hashtag;
        this.viewCount = viewCount; this.goodCount = goodCount;
        this.createdAt = createdAt; this.updatedAt = updatedAt;
    }

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = Instant.now(); }

    public static EyesPost toDomain(EyesPostJpaEntity e, java.util.List<java.util.UUID> friends) {
        return new EyesPost(e.id, e.ownerPersonaId, e.imageUrl, e.tag, e.hashtag, friends,
                e.viewCount, e.goodCount, e.createdAt, e.updatedAt);
    }
}