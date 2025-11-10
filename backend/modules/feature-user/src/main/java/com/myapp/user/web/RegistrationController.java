package com.myapp.user.web;

import com.myapp.user.application.UserRegistrationService;
import com.myapp.user.web.dto.RegistrationRequest;
import com.myapp.user.web.dto.RegistrationResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class RegistrationController {

    private final UserRegistrationService registrationService;

    public RegistrationController(UserRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationResponse register(@Valid @RequestBody RegistrationRequest req) {
        registrationService.register(
                req.email, req.phoneE164, req.password,
                req.eyesPersonaId, req.voicesPersonaId,
                req.birthdate // null 可
        );
        return new RegistrationResponse(true, req.eyesPersonaId, req.voicesPersonaId);
    }
}