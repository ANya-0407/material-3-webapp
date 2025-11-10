package com.myapp.user.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record User(
        UUID id,
        String email,          // lower-case で保存
        String phoneE164,      // +81... など E.164
        String passwordHash,   // BCrypt
        LocalDate birthdate,   // 保存のみ（公開は Persona 側で制御）
        UserStatus status,
        Instant createdAt,
        Instant updatedAt
) {}