package com.myapp.post.infrastructure.persistence.jpa.eyes;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "eyes_post_friend_links",
        uniqueConstraints = @UniqueConstraint(name="uk_eyes_friend_unique", columnNames = {"post_id", "friend_post_id"})
)
public class EyesPostFriendLinkJpaEntity {

    @EmbeddedId
    private EyesPostFriendLinkId id;

    @Column(name = "post_id", nullable = false, insertable = false, updatable = false)
    private UUID postId;

    @Column(name = "friend_post_id", nullable = false)
    private UUID friendPostId;

    protected EyesPostFriendLinkJpaEntity() {}

    public EyesPostFriendLinkJpaEntity(EyesPostFriendLinkId id, UUID friendPostId) {
        this.id = id; this.postId = id.getPostId(); this.friendPostId = friendPostId;
    }

    public EyesPostFriendLinkId getId() { return id; }
    public UUID getFriendPostId() { return friendPostId; }
}