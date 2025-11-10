package com.myapp.post.domain;

import java.util.UUID;

public interface PostLikeReader {
    boolean existsEyesLike(UUID postId, UUID byPersonaId);
    boolean existsVoicesLike(UUID postId, UUID byPersonaId);
}