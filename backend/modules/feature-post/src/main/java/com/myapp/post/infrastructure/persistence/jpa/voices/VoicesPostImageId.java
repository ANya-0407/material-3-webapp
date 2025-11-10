package com.myapp.post.infrastructure.persistence.jpa.voices;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class VoicesPostImageId implements Serializable {
    private UUID postId;
    private short ordinal;

    public VoicesPostImageId() {}
    public VoicesPostImageId(UUID postId, short ordinal) { this.postId = postId; this.ordinal = ordinal; }

    public UUID getPostId() { return postId; }
    public short getOrdinal() { return ordinal; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof VoicesPostImageId that)) return false;
        return ordinal == that.ordinal && Objects.equals(postId, that.postId);
    }
    @Override public int hashCode() { return Objects.hash(postId, ordinal); }
}