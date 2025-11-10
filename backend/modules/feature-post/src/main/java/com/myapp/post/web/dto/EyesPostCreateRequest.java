package com.myapp.post.web.dto;

import jakarta.validation.constraints.*;

import java.util.List;
import java.util.UUID;

public class EyesPostCreateRequest {

    @NotBlank
    public String image;

    @Size(max = 50)
    public String tag;

    @Size(max = 100)
    public String hashtag;

    // 順序を保持：0..49 の上限は DB 側 CHECK + アプリ側でサイズ制限
    @Size(max = 50)
    public List<UUID> friends_post_ids;
}