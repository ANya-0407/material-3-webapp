package com.myapp.post.application;

import com.myapp.post.domain.*;
import com.myapp.post.infrastructure.persistence.jpa.eyes.EyesPostRepositoryJpaAdapter;
import com.myapp.post.infrastructure.persistence.jpa.voices.VoicesPostRepositoryJpaAdapter;
import com.myapp.post.infrastructure.persistence.jpa.eyes.SpringDataEyesPostLikeRepository;
import com.myapp.post.infrastructure.persistence.jpa.voices.SpringDataVoicesPostLikeRepository;
import com.myapp.post.infrastructure.persistence.jpa.eyes.SpringDataEyesPostBookmarkRepository;
import com.myapp.post.infrastructure.persistence.jpa.voices.SpringDataVoicesPostBookmarkRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PostModuleConfig {

    @Bean
    public EyesPostRepository eyesPostRepository(EyesPostRepositoryJpaAdapter impl) { return impl; }

    @Bean
    public VoicesPostRepository voicesPostRepository(VoicesPostRepositoryJpaAdapter impl) { return impl; }

    @Bean
    public PostLikeReader postLikeReader(SpringDataEyesPostLikeRepository e, SpringDataVoicesPostLikeRepository v) {
        return new PostLikeReader() {
            @Override public boolean existsEyesLike(java.util.UUID postId, java.util.UUID byPersonaId) {
                return e.existsByPostIdAndByPersonaId(postId, byPersonaId);
            }
            @Override public boolean existsVoicesLike(java.util.UUID postId, java.util.UUID byPersonaId) {
                return v.existsByPostIdAndByPersonaId(postId, byPersonaId);
            }
        };
    }

    @Bean
    public PostBookmarkReader postBookmarkReader(SpringDataEyesPostBookmarkRepository e, SpringDataVoicesPostBookmarkRepository v) {
        return new PostBookmarkReader() {
            @Override public boolean existsEyesBookmark(java.util.UUID postId, java.util.UUID byPersonaId) {
                return e.existsByPostIdAndByPersonaId(postId, byPersonaId);
            }
            @Override public boolean existsVoicesBookmark(java.util.UUID postId, java.util.UUID byPersonaId) {
                return v.existsByPostIdAndByPersonaId(postId, byPersonaId);
            }
        };
    }
}