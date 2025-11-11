package com.myapp.relation.application;

import com.myapp.common.NotFoundException;
import com.myapp.relation.domain.EyesRelationRepository;
import com.myapp.relation.infrastructure.persistence.jpa.persona.PersonaRefJpaEntity;
import com.myapp.relation.infrastructure.persistence.jpa.persona.PersonaRefJpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

public class EyesRelationService {

    private final PersonaRefJpaRepository personaRepo;
    private final EyesRelationRepository repo;

    public EyesRelationService(PersonaRefJpaRepository personaRepo, EyesRelationRepository repo) {
        this.personaRepo = personaRepo;
        this.repo = repo;
    }

    private static String EYES() { return "EYES"; }

    private PersonaRefJpaEntity requirePersona(UUID id, String requiredType) {
        var p = personaRepo.findById(id).orElseThrow(() -> new NotFoundException("actor persona not found"));
        if (!requiredType.equals(p.getType())) {
            throw new IllegalArgumentException("actor persona type mismatch: requires " + requiredType);
        }
        return p;
    }

    private PersonaRefJpaEntity resolveTarget(String accountId, String requiredType) {
        var p = personaRepo.findByTypeAndPersonaId(requiredType, accountId.toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new NotFoundException("target account not found"));
        return p;
    }

    @Transactional
    public void follow(UUID actorPersonaId, String targetAccountId) {
        var actor = requirePersona(actorPersonaId, EYES());
        var target = resolveTarget(targetAccountId, EYES());

        if (actor.getId().equals(target.getId())) {
            throw new IllegalArgumentException("cannot follow yourself");
        }
        if (repo.existsBlockEitherDirection(actor.getId(), target.getId())) {
            throw new IllegalArgumentException("blocked relationship prevents follow");
        }
        repo.upsertFollow(actor.getId(), target.getId()); // 冪等
    }

    @Transactional
    public void unfollow(UUID actorPersonaId, String targetAccountId) {
        var actor = requirePersona(actorPersonaId, EYES());
        var target = resolveTarget(targetAccountId, EYES());
        if (actor.getId().equals(target.getId())) return; // no-op
        repo.deleteFollow(actor.getId(), target.getId());  // 冪等
    }

    @Transactional
    public void block(UUID actorPersonaId, String targetAccountId) {
        var actor = requirePersona(actorPersonaId, EYES());
        var target = resolveTarget(targetAccountId, EYES());
        if (actor.getId().equals(target.getId())) {
            throw new IllegalArgumentException("cannot block yourself");
        }
        // ブロック優先・双方向フォロー解除 → ブロックUPSERT
        repo.deleteFollowsBothDirections(actor.getId(), target.getId());
        repo.upsertBlock(actor.getId(), target.getId());   // 冪等
    }

    @Transactional
    public void unblock(UUID actorPersonaId, String targetAccountId) {
        var actor = requirePersona(actorPersonaId, EYES());
        var target = resolveTarget(targetAccountId, EYES());
        if (actor.getId().equals(target.getId())) return; // no-op
        repo.deleteBlock(actor.getId(), target.getId());   // 冪等
    }

    @Transactional(readOnly = true)
    public RelationState state(UUID actorPersonaId, String targetAccountId) {
        var actor = requirePersona(actorPersonaId, EYES());
        var target = resolveTarget(targetAccountId, EYES());
        boolean isFollowing  = repo.existsFollow(actor.getId(), target.getId());
        boolean isFollowedBy = repo.existsFollow(target.getId(), actor.getId());
        boolean isBlocking   = repo.existsBlock(actor.getId(), target.getId());
        boolean isBlockedBy  = repo.existsBlock(target.getId(), actor.getId());
        return new RelationState(isFollowing, isFollowedBy, isBlocking, isBlockedBy);
    }

    public record RelationState(boolean isFollowing, boolean isFollowedBy,
                                boolean isBlocking, boolean isBlockedBy) {}
}