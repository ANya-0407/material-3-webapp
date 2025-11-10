package com.myapp.post.infrastructure.persistence.jpa.voices;

import jakarta.persistence.*;

@Entity
@Table(name = "voices_post_bookmarks")
public class VoicesPostBookmarkJpaEntity {
    @EmbeddedId
    private VoicesPostBookmarkId id;

    protected VoicesPostBookmarkJpaEntity() {}
    public VoicesPostBookmarkJpaEntity(VoicesPostBookmarkId id) { this.id = id; }
}