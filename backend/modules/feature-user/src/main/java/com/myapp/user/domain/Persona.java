package com.myapp.user.domain;

import java.time.Instant;
import java.util.UUID;

public record Persona(
        UUID id,                  // 内部PK（UUID）
        UUID userId,              // FK（外部には秘匿）
        PersonaType type,         // EYES / VOICES
        String personaId,         // 公開ハンドル（type 内ユニーク）
        String personaName,       // 表示名（自由）
        String iconUrl,           // 画像URL
        String headerUrl,         // 画像URL（ヘッダー）
        String bio,               // 説明
        BirthdateVisibility birthdateVisibility, // NONE/MONTH_DAY/FULL_DATE
        boolean active,           // true=有効
        Instant createdAt,
        Instant updatedAt
) {}