package com.myapp.relation.web;

import com.myapp.relation.application.VoicesRelationService;
import com.myapp.relation.web.dto.RelationOperateRequest;
import com.myapp.relation.web.dto.RelationStateResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/voices/relations")
public class VoicesRelationController {

    private final VoicesRelationService service;

    public VoicesRelationController(VoicesRelationService service) {
        this.service = service;
    }

    @PostMapping("/follow")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('SCOPE_voices:relations:write')")
    public void follow(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody RelationOperateRequest req) {
        UUID actor = UUID.fromString(jwt.getClaimAsString("sub"));
        service.follow(actor, req.targetAccountId);
    }

    @DeleteMapping("/follow/{targetAccountId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('SCOPE_voices:relations:write')")
    public void unfollow(@AuthenticationPrincipal Jwt jwt, @PathVariable String targetAccountId) {
        UUID actor = UUID.fromString(jwt.getClaimAsString("sub"));
        service.unfollow(actor, targetAccountId);
    }

    @PostMapping("/block")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('SCOPE_voices:relations:write')")
    public void block(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody RelationOperateRequest req) {
        UUID actor = UUID.fromString(jwt.getClaimAsString("sub"));
        service.block(actor, req.targetAccountId);
    }

    @DeleteMapping("/block/{targetAccountId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('SCOPE_voices:relations:write')")
    public void unblock(@AuthenticationPrincipal Jwt jwt, @PathVariable String targetAccountId) {
        UUID actor = UUID.fromString(jwt.getClaimAsString("sub"));
        service.unblock(actor, targetAccountId);
    }

    @GetMapping("/state/{targetAccountId}")
    @PreAuthorize("hasAuthority('SCOPE_voices:relations:read')")
    public RelationStateResponse state(@AuthenticationPrincipal Jwt jwt, @PathVariable String targetAccountId) {
        UUID actor = UUID.fromString(jwt.getClaimAsString("sub"));
        var s = service.state(actor, targetAccountId);
        return new RelationStateResponse(s.isFollowing(), s.isFollowedBy(), s.isBlocking(), s.isBlockedBy());
    }
}