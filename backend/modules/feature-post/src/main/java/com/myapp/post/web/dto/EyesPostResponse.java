package com.myapp.post.web.dto;

import java.time.Instant;
import java.util.List;

public record EyesPostResponse(
        String eyes_id,
        PosterDto poster,
        String image,
        String tag,
        String hashtag,
        List<String> friends_post_ids,  // UUID を文字列で返す
        Instant created_at,
        long view_count,
        long good_count,
        boolean is_own,
        boolean is_good_for_me,
        boolean is_my_bookmark
) {
    public record PosterDto(String accountId, String accountName, String icon, String header) {}
}