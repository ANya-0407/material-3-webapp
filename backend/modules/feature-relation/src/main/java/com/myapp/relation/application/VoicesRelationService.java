package com.myapp.relation.application;

import com.myapp.common.NotFoundException;
import com.myapp.relation.domain.VoicesRelationRepository;
import com.myapp.relation.infrastructure.persistence.jpa.persona.PersonaRefJpaEntity;
import com.myapp.relation.infrastructure.persistence.jpa.persona.PersonaRefJpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

public class VoicesRelationService {

    private final PersonaRefJpaRepository personaRepo;
    private final VoicesRelationRepository repo;

    public VoicesRelationService(PersonaRefJpaRepository personaRepo, VoicesRelationRepository repo) {
        this.personaRepo = personaRepo;
        this.repo = repo;
    }

    private static String VOICES() { return "VOICES"; }

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
        var actor = requirePersona(actorPersonaId, VOICES());
        var target = resolveTarget(targetAccountId, VOICES());

        if (actor.getId().equals(target.getId())) {
            throw new IllegalArgumentException("cannot follow yourself");
        }
        if (repo.existsBlockEitherDirection(actor.getId(), target.getId())) {
            throw new IllegalArgumentException("blocked relationship prevents follow");
        }
        repo.upsertFollow(actor.getId(), target.getId());
    }

    @Transactional
    public void unfollow(UUID actorPersonaId, String targetAccountId) {
        var actor = requirePersona(actorPersonaId, VOICES());
        var target = resolveTarget(targetAccountId, VOICES());
        if (actor.getId().equals(target.getId())) return;
        repo.deleteFollow(actor.getId(), target.getId());
    }

    @Transactional
    public void block(UUID actorPersonaId, String targetAccountId) {
        var actor = requirePersona(actorPersonaId, VOICES());
        var target = resolveTarget(targetAccountId, VOICES());
        if (actor.getId().equals(target.getId())) {
            throw new IllegalArgumentException("cannot block yourself");
        }
        repo.deleteFollowsBothDirections(actor.getId(), target.getId());
        repo.upsertBlock(actor.getId(), target.getId());
    }

    @Transactional
    public void unblock(UUID actorPersonaId, String targetAccountId) {
        var actor = requirePersona(actorPersonaId, VOICES());
        var target = resolveTarget(targetAccountId, VOICES());
        if (actor.getId().equals(target.getId())) return;
        repo.deleteBlock(actor.getId(), target.getId());
    }

    @Transactional(readOnly = true)
    public RelationState state(UUID actorPersonaId, String targetAccountId) {
        var actor = requirePersona(actorPersonaId, VOICES());
        var target = resolveTarget(targetAccountId, VOICES());
        boolean isFollowing  = repo.existsFollow(actor.getId(), target.getId());
        boolean isFollowedBy = repo.existsFollow(target.getId(), actor.getId());
        boolean isBlocking   = repo.existsBlock(actor.getId(), target.getId());
        boolean isBlockedBy  = repo.existsBlock(target.getId(), actor.getId());
        return new RelationState(isFollowing, isFollowedBy, isBlocking, isBlockedBy);
    }

    public record RelationState(boolean isFollowing, boolean isFollowedBy,
                                boolean isBlocking, boolean isBlockedBy) {}
}