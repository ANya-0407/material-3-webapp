package com.myapp.relation.infrastructure.persistence.jpa.eyes;

import com.myapp.relation.domain.EyesRelationRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Repository
public class EyesRelationRepositoryJpaAdapter implements EyesRelationRepository {

    private final SpringDataEyesFollowRepository followRepo;
    private final SpringDataEyesBlockRepository blockRepo;

    public EyesRelationRepositoryJpaAdapter(SpringDataEyesFollowRepository followRepo,
                                            SpringDataEyesBlockRepository blockRepo) {
        this.followRepo = followRepo; this.blockRepo = blockRepo;
    }

    @Override public boolean existsFollow(UUID followerPersonaId, UUID followeePersonaId) {
        return followRepo.existsPair(followerPersonaId, followeePersonaId);
    }

    @Override public boolean existsBlock(UUID blockerPersonaId, UUID blockedPersonaId) {
        return blockRepo.existsAT(blockerPersonaId, blockedPersonaId);
    }

    @Override public boolean existsBlockEitherDirection(UUID aPersonaId, UUID bPersonaId) {
        return blockRepo.existsEitherDirection(aPersonaId, bPersonaId);
    }

    @Override @Transactional
    public void upsertFollow(UUID followerPersonaId, UUID followeePersonaId) {
        followRepo.upsert(followerPersonaId, followeePersonaId);
    }

    @Override @Transactional
    public void deleteFollow(UUID followerPersonaId, UUID followeePersonaId) {
        followRepo.deletePair(followerPersonaId, followeePersonaId);
    }

    @Override @Transactional
    public void deleteFollowsBothDirections(UUID aPersonaId, UUID bPersonaId) {
        followRepo.deleteBoth(aPersonaId, bPersonaId);
    }

    @Override @Transactional
    public void upsertBlock(UUID blockerPersonaId, UUID blockedPersonaId) {
        blockRepo.upsert(blockerPersonaId, blockedPersonaId);
    }

    @Override @Transactional
    public void deleteBlock(UUID blockerPersonaId, UUID blockedPersonaId) {
        blockRepo.deletePair(blockerPersonaId, blockedPersonaId);
    }
}