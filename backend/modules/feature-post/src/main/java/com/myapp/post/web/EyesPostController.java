package com.myapp.post.web;

import com.myapp.post.application.EyesPostService;
import com.myapp.post.infrastructure.persistence.jpa.persona.PersonaRefJpaRepository;
import com.myapp.post.web.dto.EyesPostCreateRequest;
import com.myapp.post.web.dto.EyesPostResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/eyes/posts")
public class EyesPostController {

    private final EyesPostService service;
    private final PersonaRefJpaRepository personaRepo;

    public EyesPostController(EyesPostService service, PersonaRefJpaRepository personaRepo) {
        this.service = service; this.personaRepo = personaRepo;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_eyes:write')")
    public EyesPostResponse create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody EyesPostCreateRequest req) {
        UUID ownerPersonaId = UUID.fromString(jwt.getClaimAsString("sub"));
        var post = service.create(ownerPersonaId, req.image, req.tag, req.hashtag, req.friends_post_ids);

        var persona = personaRepo.findById(ownerPersonaId).orElseThrow();
        return new EyesPostResponse(
                post.id().toString(),
                new EyesPostResponse.PosterDto(persona.getPersonaId(), persona.getPersonaName(),
                        persona.getIconUrl(), persona.getHeaderUrl()),
                post.imageUrl(), post.tag(), post.hashtag(),
                post.friendPostIds().stream().map(UUID::toString).toList(),
                post.createdAt(), post.viewCount(), post.goodCount(),
                true, false, false
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_eyes:read')")
    public EyesPostResponse get(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        UUID viewer = UUID.fromString(jwt.getClaimAsString("sub"));
        var post = service.get(id);
        var persona = personaRepo.findById(post.ownerPersonaId()).orElseThrow();

        boolean isOwn = service.isOwn(id, viewer);
        boolean good = service.isGoodForMe(id, viewer);
        boolean bookmark = service.isMyBookmark(id, viewer);

        return new EyesPostResponse(
                post.id().toString(),
                new EyesPostResponse.PosterDto(persona.getPersonaId(), persona.getPersonaName(),
                        persona.getIconUrl(), persona.getHeaderUrl()),
                post.imageUrl(), post.tag(), post.hashtag(),
                post.friendPostIds().stream().map(UUID::toString).toList(),
                post.createdAt(), post.viewCount(), post.goodCount(),
                isOwn, good, bookmark
        );
    }
}