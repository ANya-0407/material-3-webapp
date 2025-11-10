package com.myapp.post.domain;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record VoicesPost(
        UUID id,
        UUID ownerPersonaId,
        String text,
        List<String> imageUrls,
        String hashtag,
        long viewCount,
        long goodCount,
        Instant createdAt,
        Instant updatedAt
) {}