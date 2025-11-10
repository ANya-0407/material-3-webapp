package com.myapp.post.domain;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record EyesPost(
        UUID id,
        UUID ownerPersonaId,
        String imageUrl,
        String tag,
        String hashtag,
        List<UUID> friendPostIds,
        long viewCount,
        long goodCount,
        Instant createdAt,
        Instant updatedAt
) {}