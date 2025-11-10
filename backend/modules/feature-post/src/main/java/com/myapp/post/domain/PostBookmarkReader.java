package com.myapp.post.domain;

import java.util.UUID;

public interface PostBookmarkReader {
    boolean existsEyesBookmark(UUID postId, UUID byPersonaId);
    boolean existsVoicesBookmark(UUID postId, UUID byPersonaId);
}