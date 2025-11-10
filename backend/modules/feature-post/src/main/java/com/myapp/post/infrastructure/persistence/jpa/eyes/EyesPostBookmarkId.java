package com.myapp.post.infrastructure.persistence.jpa.eyes;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class EyesPostBookmarkId implements Serializable {
    private UUID postId;
    private UUID byPersonaId;

    public EyesPostBookmarkId() {}
    public EyesPostBookmarkId(UUID postId, UUID byPersonaId) {
        this.postId = postId; this.byPersonaId = byPersonaId;
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EyesPostBookmarkId that)) return false;
        return Objects.equals(postId, that.postId) && Objects.equals(byPersonaId, that.byPersonaId);
    }
    @Override public int hashCode() { return Objects.hash(postId, byPersonaId); }
}