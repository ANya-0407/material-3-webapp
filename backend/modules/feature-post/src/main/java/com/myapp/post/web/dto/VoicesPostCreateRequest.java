package com.myapp.post.web.dto;

import jakarta.validation.constraints.*;

import java.util.List;

public class VoicesPostCreateRequest {
    @Size(max = 5000)
    public String text;

    @NotNull
    @Size(max = 4)
    public List<@NotBlank String> images;

    @Size(max = 100)
    public String hashtag;
}