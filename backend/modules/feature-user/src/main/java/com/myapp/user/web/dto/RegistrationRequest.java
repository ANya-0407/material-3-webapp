package com.myapp.user.web.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class RegistrationRequest {
    @NotBlank @Email @Size(max = 254)
    public String email;

    @NotBlank
    @Pattern(regexp = "^\\+[1-9]\\d{1,14}$") // E.164
    public String phoneE164;

    @NotBlank @Size(min = 8, max = 128)
    public String password;

    @NotBlank @Pattern(regexp = "^[a-z0-9_]{3,30}$")
    public String eyesPersonaId;

    @NotBlank @Pattern(regexp = "^[a-z0-9_]{3,30}$")
    public String voicesPersonaId;

    // 保存のみ（公開は Persona 側の可視性で制御）
    public LocalDate birthdate;
}