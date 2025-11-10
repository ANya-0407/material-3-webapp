package com.myapp.post.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VoicesPostRepository {
    VoicesPost save(VoicesPost post, List<String> imageUrls);
    Optional<VoicesPost> findById(UUID id);
}