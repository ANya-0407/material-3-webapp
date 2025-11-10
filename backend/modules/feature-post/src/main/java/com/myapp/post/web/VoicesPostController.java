package com.myapp.post.web;

import com.myapp.post.application.VoicesPostService;
import com.myapp.post.infrastructure.persistence.jpa.persona.PersonaRefJpaRepository;
import com.myapp.post.web.dto.VoicesPostCreateRequest;
import com.myapp.post.web.dto.VoicesPostResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/voices/posts")
public class VoicesPostController {

    private final VoicesPostService service;
    private final PersonaRefJpaRepository personaRepo;

    public VoicesPostController(VoicesPostService service, PersonaRefJpaRepository personaRepo) {
        this.service = service; this.personaRepo = personaRepo;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_voices:write')")
    public VoicesPostResponse create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody VoicesPostCreateRequest req) {
        UUID ownerPersonaId = UUID.fromString(jwt.getClaimAsString("sub"));
        var post = service.create(ownerPersonaId, req.text, req.images, req.hashtag);
        var persona = personaRepo.findById(ownerPersonaId).orElseThrow();

        return new VoicesPostResponse(
                post.id().toString(),
                new VoicesPostResponse.PosterDto(persona.getPersonaId(), persona.getPersonaName(),
                        persona.getIconUrl(), persona.getHeaderUrl()),
                post.text(), post.imageUrls(), post.hashtag(),
                post.createdAt(), post.viewCount(), post.goodCount(),
                true, false, false
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SCOPE_voices:read')")
    public VoicesPostResponse get(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        UUID viewer = UUID.fromString(jwt.getClaimAsString("sub"));
        var post = service.get(id);
        var persona = personaRepo.findById(post.ownerPersonaId()).orElseThrow();

        boolean isOwn = service.isOwn(id, viewer);
        boolean good = service.isGoodForMe(id, viewer);
        boolean bookmark = service.isMyBookmark(id, viewer);

        return new VoicesPostResponse(
                post.id().toString(),
                new VoicesPostResponse.PosterDto(persona.getPersonaId(), persona.getPersonaName(),
                        persona.getIconUrl(), persona.getHeaderUrl()),
                post.text(), post.imageUrls(), post.hashtag(),
                post.createdAt(), post.viewCount(), post.goodCount(),
                isOwn, good, bookmark
        );
    }
}