package com.myapp.post.infrastructure.persistence.jpa.voices;

import com.myapp.post.domain.VoicesPost;
import com.myapp.post.domain.VoicesPostRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Repository
public class VoicesPostRepositoryJpaAdapter implements VoicesPostRepository {

    private final SpringDataVoicesPostJpaRepository postRepo;
    private final SpringDataVoicesPostImageRepository imageRepo;

    public VoicesPostRepositoryJpaAdapter(SpringDataVoicesPostJpaRepository postRepo,
                                          SpringDataVoicesPostImageRepository imageRepo) {
        this.postRepo = postRepo; this.imageRepo = imageRepo;
    }

    @Override
    @Transactional
    public VoicesPost save(VoicesPost post, List<String> imageUrls) {
        var e = new VoicesPostJpaEntity(post.id(), post.ownerPersonaId(), post.text(),
                post.hashtag(), post.viewCount(), post.goodCount(), post.createdAt(), post.updatedAt());
        postRepo.save(e);

        short ord = 0;
        if (imageUrls != null) {
            for (String url : imageUrls) {
                if (ord >= 4) throw new IllegalArgumentException("images up to 4");
                var id = new VoicesPostImageId(post.id(), ord++);
                imageRepo.save(new VoicesPostImageJpaEntity(id, url));
            }
        }
        var imgs = imageRepo.findById_PostIdOrderById_OrdinalAsc(post.id());
        var urls = imgs.stream().map(VoicesPostImageJpaEntity::getUrl).toList();

        return new VoicesPost(e.getId(), e.getOwnerPersonaId(), e.getText(), urls,
                e.getHashtag(), e.getViewCount(), e.getGoodCount(), e.getCreatedAt(), e.getUpdatedAt());
    }

    @Override
    public Optional<VoicesPost> findById(java.util.UUID id) {
        var e = postRepo.findById(id);
        if (e.isEmpty()) return Optional.empty();
        var imgs = imageRepo.findById_PostIdOrderById_OrdinalAsc(id);
        var urls = imgs.stream().map(VoicesPostImageJpaEntity::getUrl).toList();

        var v = e.get();
        return Optional.of(new VoicesPost(v.getId(), v.getOwnerPersonaId(), v.getText(), urls,
                v.getHashtag(), v.getViewCount(), v.getGoodCount(), v.getCreatedAt(), v.getUpdatedAt()));
    }
}