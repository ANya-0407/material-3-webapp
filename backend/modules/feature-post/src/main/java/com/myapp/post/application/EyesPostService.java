package com.myapp.post.application;

import com.myapp.common.NotFoundException;
import com.myapp.post.domain.*;
import com.myapp.post.infrastructure.persistence.jpa.persona.PersonaRefJpaEntity;
import com.myapp.post.infrastructure.persistence.jpa.persona.PersonaRefJpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

public class EyesPostService {

    private final EyesPostRepository repo;
    private final PersonaRefJpaRepository personaRepo;
    private final PostLikeReader likeReader;
    private final PostBookmarkReader bookmarkReader;

    public EyesPostService(EyesPostRepository repo, PersonaRefJpaRepository personaRepo,
                           PostLikeReader likeReader, PostBookmarkReader bookmarkReader) {
        this.repo = repo; this.personaRepo = personaRepo;
        this.likeReader = likeReader; this.bookmarkReader = bookmarkReader;
    }

    private static String normTag(String s) { return s == null ? null : s.trim(); }
    private static String normHashtag(String s) {
        if (s == null || s.isBlank()) return null;
        String t = s.trim();
        return t.startsWith("#") ? t : "#" + t;
    }

    @Transactional
    public EyesPost create(UUID ownerPersonaId, String imageUrl, String tag, String hashtag, List<UUID> friendPostIds) {
        var p = personaRepo.findById(ownerPersonaId)
                .orElseThrow(() -> new NotFoundException("owner persona not found"));
        if (!"EYES".equals(p.getType())) {
            throw new IllegalArgumentException("owner persona type mismatch: requires EYES");
        }
        Instant now = Instant.now();
        EyesPost post = new EyesPost(
                UUID.randomUUID(), ownerPersonaId, imageUrl,
                normTag(tag), normHashtag(hashtag),
                friendPostIds == null ? List.of() : List.copyOf(friendPostIds),
                0L, 0L, now, now
        );
        return repo.save(post, post.friendPostIds());
    }

    public EyesPost get(UUID postId) {
        return repo.findById(postId)
                .orElseThrow(() -> new NotFoundException("eyes post not found"));
    }

    public boolean isOwn(UUID postId, UUID viewerPersonaId) {
        var post = get(postId);
        return post.ownerPersonaId().equals(viewerPersonaId);
    }

    public boolean isGoodForMe(UUID postId, UUID viewerPersonaId) {
        return likeReader.existsEyesLike(postId, viewerPersonaId);
    }

    public boolean isMyBookmark(UUID postId, UUID viewerPersonaId) {
        return bookmarkReader.existsEyesBookmark(postId, viewerPersonaId);
    }
}