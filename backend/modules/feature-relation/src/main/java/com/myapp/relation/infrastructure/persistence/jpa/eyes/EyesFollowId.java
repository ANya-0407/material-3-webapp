package com.myapp.relation.infrastructure.persistence.jpa.eyes;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class EyesFollowId implements Serializable {
    private UUID followerPersonaId;
    private UUID followeePersonaId;

    public EyesFollowId() {}
    public EyesFollowId(UUID followerPersonaId, UUID followeePersonaId) {
        this.followerPersonaId = followerPersonaId; this.followeePersonaId = followeePersonaId;
    }

    public UUID getFollowerPersonaId() { return followerPersonaId; }
    public UUID getFolloweePersonaId() { return followeePersonaId; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EyesFollowId that)) return false;
        return Objects.equals(followerPersonaId, that.followerPersonaId)
                && Objects.equals(followeePersonaId, that.followeePersonaId);
    }
    @Override public int hashCode() { return Objects.hash(followerPersonaId, followeePersonaId); }
}