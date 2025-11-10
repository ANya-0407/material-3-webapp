package com.myapp.post.infrastructure.persistence.jpa.eyes;

import com.myapp.post.domain.EyesPost;
import com.myapp.post.domain.EyesPostRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Repository
public class EyesPostRepositoryJpaAdapter implements EyesPostRepository {

    private final SpringDataEyesPostJpaRepository postRepo;
    private final SpringDataEyesPostFriendLinkRepository linkRepo;

    public EyesPostRepositoryJpaAdapter(SpringDataEyesPostJpaRepository postRepo,
                                        SpringDataEyesPostFriendLinkRepository linkRepo) {
        this.postRepo = postRepo; this.linkRepo = linkRepo;
    }

    @Override
    @Transactional
    public EyesPost save(EyesPost post, List<java.util.UUID> friendPostIds) {
        var e = new EyesPostJpaEntity(post.id(), post.ownerPersonaId(), post.imageUrl(),
                post.tag(), post.hashtag(), post.viewCount(), post.goodCount(), post.createdAt(), post.updatedAt());
        postRepo.save(e);

        if (friendPostIds != null && !friendPostIds.isEmpty()) {
            short ord = 0;
            for (var fid : friendPostIds) {
                var id = new EyesPostFriendLinkId(post.id(), ord++);
                linkRepo.save(new EyesPostFriendLinkJpaEntity(id, fid));
            }
        }
        var links = linkRepo.findByPostIdOrderById_OrdinalAsc(post.id());
        var friendIds = links.stream().map(EyesPostFriendLinkJpaEntity::getFriendPostId).toList();
        return EyesPostJpaEntity.toDomain(e, friendIds);
    }

    @Override
    public Optional<EyesPost> findById(java.util.UUID id) {
        var e = postRepo.findById(id);
        if (e.isEmpty()) return Optional.empty();
        var links = linkRepo.findByPostIdOrderById_OrdinalAsc(id);
        var friendIds = links.stream().map(EyesPostFriendLinkJpaEntity::getFriendPostId).toList();
        return Optional.of(EyesPostJpaEntity.toDomain(e.get(), friendIds));
    }
}