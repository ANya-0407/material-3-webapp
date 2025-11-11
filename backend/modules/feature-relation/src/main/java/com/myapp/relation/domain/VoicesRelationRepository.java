package com.myapp.relation.domain;

import java.util.UUID;

public interface VoicesRelationRepository {
    boolean existsFollow(UUID followerPersonaId, UUID followeePersonaId);
    boolean existsBlock(UUID blockerPersonaId, UUID blockedPersonaId);
    boolean existsBlockEitherDirection(UUID aPersonaId, UUID bPersonaId);

    void upsertFollow(UUID followerPersonaId, UUID followeePersonaId);
    void deleteFollow(UUID followerPersonaId, UUID followeePersonaId);
    void deleteFollowsBothDirections(UUID aPersonaId, UUID bPersonaId);

    void upsertBlock(UUID blockerPersonaId, UUID blockedPersonaId);
    void deleteBlock(UUID blockerPersonaId, UUID blockedPersonaId);
}