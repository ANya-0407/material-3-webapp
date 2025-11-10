package com.myapp.post.infrastructure.persistence.jpa.eyes;

import jakarta.persistence.*;

@Entity
@Table(name = "eyes_post_bookmarks")
public class EyesPostBookmarkJpaEntity {
    @EmbeddedId
    private EyesPostBookmarkId id;

    protected EyesPostBookmarkJpaEntity() {}
    public EyesPostBookmarkJpaEntity(EyesPostBookmarkId id) { this.id = id; }
}