package com.myapp.post.infrastructure.persistence.jpa.voices;

import jakarta.persistence.*;

@Entity
@Table(name = "voices_post_images")
public class VoicesPostImageJpaEntity {
    @EmbeddedId
    private VoicesPostImageId id;

    @Column(name = "url", nullable = false)
    private String url;

    protected VoicesPostImageJpaEntity() {}
    public VoicesPostImageJpaEntity(VoicesPostImageId id, String url) { this.id = id; this.url = url; }

    public String getUrl() { return url; }
    public VoicesPostImageId getId() { return id; }
}