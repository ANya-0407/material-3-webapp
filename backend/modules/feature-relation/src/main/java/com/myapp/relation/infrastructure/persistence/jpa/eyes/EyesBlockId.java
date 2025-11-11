package com.myapp.relation.infrastructure.persistence.jpa.eyes;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class EyesBlockId implements Serializable {
    private UUID blockerPersonaId;
    private UUID blockedPersonaId;

    public EyesBlockId() {}
    public EyesBlockId(UUID blockerPersonaId, UUID blockedPersonaId) {
        this.blockerPersonaId = blockerPersonaId; this.blockedPersonaId = blockedPersonaId;
    }

    public UUID getBlockerPersonaId() { return blockerPersonaId; }
    public UUID getBlockedPersonaId() { return blockedPersonaId; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EyesBlockId that)) return false;
        return Objects.equals(blockerPersonaId, that.blockerPersonaId)
                && Objects.equals(blockedPersonaId, that.blockedPersonaId);
    }
    @Override public int hashCode() { return Objects.hash(blockerPersonaId, blockedPersonaId); }
}