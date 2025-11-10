package com.myapp.post.infrastructure.persistence.jpa.eyes;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class EyesPostFriendLinkId implements Serializable {
    private UUID postId;
    private short ordinal;

    public EyesPostFriendLinkId() {}
    public EyesPostFriendLinkId(UUID postId, short ordinal) {
        this.postId = postId; this.ordinal = ordinal;
    }

    public UUID getPostId() { return postId; }
    public short getOrdinal() { return ordinal; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EyesPostFriendLinkId that)) return false;
        return ordinal == that.ordinal && Objects.equals(postId, that.postId);
    }

    @Override public int hashCode() { return Objects.hash(postId, ordinal); }
}