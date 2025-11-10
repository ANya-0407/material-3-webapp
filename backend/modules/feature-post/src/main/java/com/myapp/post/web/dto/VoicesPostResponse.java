package com.myapp.post.web.dto;

import java.time.Instant;
import java.util.List;

public record VoicesPostResponse(
        String voices_id,
        PosterDto poster,
        String text,
        List<String> images,
        String hashtag,
        Instant created_at,
        long view_count,
        long good_count,
        boolean is_own,
        boolean is_good_for_me,
        boolean is_my_bookmark
) {
    public record PosterDto(String accountId, String accountName, String icon, String header) {}
}