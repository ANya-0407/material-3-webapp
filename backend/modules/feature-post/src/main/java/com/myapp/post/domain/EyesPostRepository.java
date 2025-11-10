package com.myapp.post.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EyesPostRepository {
    EyesPost save(EyesPost post, List<UUID> friendPostIds);
    Optional<EyesPost> findById(UUID id);
}