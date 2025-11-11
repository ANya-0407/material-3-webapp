package com.myapp.relation.web.dto;

public record RelationStateResponse(
        boolean is_following,
        boolean is_followed_by,
        boolean is_blocking,
        boolean is_blocked_by
) {}