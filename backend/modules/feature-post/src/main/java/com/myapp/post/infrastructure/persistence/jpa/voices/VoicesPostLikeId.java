package com.myapp.post.infrastructure.persistence.jpa.voices;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class VoicesPostLikeId implements Serializable {
    private UUID postId;
    private UUID byPersonaId;

    public VoicesPostLikeId() {}
    public VoicesPostLikeId(UUID postId, UUID byPersonaId) { this.postId = postId; this.byPersonaId = byPersonaId; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof VoicesPostLikeId that)) return false;
        return Objects.equals(postId, that.postId) && Objects.equals(byPersonaId, that.byPersonaId);
    }
    @Override public int hashCode() { return Objects.hash(postId, byPersonaId); }
}