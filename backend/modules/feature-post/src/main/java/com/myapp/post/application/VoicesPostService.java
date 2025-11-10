package com.myapp.post.application;

import com.myapp.common.NotFoundException;
import com.myapp.post.domain.*;
import com.myapp.post.infrastructure.persistence.jpa.persona.PersonaRefJpaEntity;
import com.myapp.post.infrastructure.persistence.jpa.persona.PersonaRefJpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class VoicesPostService {

    private final VoicesPostRepository repo;
    private final PersonaRefJpaRepository personaRepo;
    private final PostLikeReader likeReader;
    private final PostBookmarkReader bookmarkReader;

    public VoicesPostService(VoicesPostRepository repo, PersonaRefJpaRepository personaRepo,
                             PostLikeReader likeReader, PostBookmarkReader bookmarkReader) {
        this.repo = repo; this.personaRepo = personaRepo;
        this.likeReader = likeReader; this.bookmarkReader = bookmarkReader;
    }

    private static List<String> sanitizeImages(List<String> images) {
        if (images == null) return List.of();
        if (images.size() > 4) throw new IllegalArgumentException("images up to 4");
        return List.copyOf(images);
    }

    @Transactional
    public VoicesPost create(UUID ownerPersonaId, String text, List<String> images, String hashtag) {
        var p = personaRepo.findById(ownerPersonaId)
                .orElseThrow(() -> new NotFoundException("owner persona not found"));
        if (!"VOICES".equals(p.getType())) {
            throw new IllegalArgumentException("owner persona type mismatch: requires VOICES");
        }
        Instant now = Instant.now();
        VoicesPost post = new VoicesPost(
                UUID.randomUUID(), ownerPersonaId,
                (text == null || text.isBlank()) ? null : text,
                sanitizeImages(images),
                (hashtag == null || hashtag.isBlank()) ? null : (hashtag.startsWith("#") ? hashtag : "#" + hashtag),
                0L, 0L, now, now
        );
        return repo.save(post, post.imageUrls());
    }

    public VoicesPost get(UUID postId) {
        return repo.findById(postId)
                .orElseThrow(() -> new NotFoundException("voices post not found"));
    }

    public boolean isOwn(UUID postId, UUID viewerPersonaId) {
        var post = get(postId);
        return post.ownerPersonaId().equals(viewerPersonaId);
    }

    public boolean isGoodForMe(UUID postId, UUID viewerPersonaId) {
        return likeReader.existsVoicesLike(postId, viewerPersonaId);
    }

    public boolean isMyBookmark(UUID postId, UUID viewerPersonaId) {
        return bookmarkReader.existsVoicesBookmark(postId, viewerPersonaId);
    }
}