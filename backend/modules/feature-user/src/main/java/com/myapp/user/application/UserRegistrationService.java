package com.myapp.user.application;

import com.myapp.user.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;

public class UserRegistrationService {

    private final UserRepository userRepo;
    private final PersonaRepository personaRepo;
    private final PasswordEncoder passwordEncoder;

    public UserRegistrationService(UserRepository userRepo, PersonaRepository personaRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.personaRepo = personaRepo;
        this.passwordEncoder = passwordEncoder;
    }

    private static String normEmail(String email) { return email.toLowerCase(Locale.ROOT); }
    private static String normHandle(String handle) { return handle.toLowerCase(Locale.ROOT); }

    @Transactional
    public void register(String email, String phoneE164, String rawPassword,
                         String eyesPersonaId, String voicesPersonaId, LocalDate birthdate) {

        String normalizedEmail = normEmail(email);
        if (userRepo.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("email already registered");
        }
        if (userRepo.existsByPhone(phoneE164)) {
            throw new IllegalArgumentException("phone already registered");
        }
        if (personaRepo.existsByTypeAndPersonaIdNormalized(PersonaType.EYES, normHandle(eyesPersonaId))) {
            throw new IllegalArgumentException("eyes personaId already taken");
        }
        if (personaRepo.existsByTypeAndPersonaIdNormalized(PersonaType.VOICES, normHandle(voicesPersonaId))) {
            throw new IllegalArgumentException("voices personaId already taken");
        }

        Instant now = Instant.now();
        UUID userId = UUID.randomUUID();
        String hash = passwordEncoder.encode(rawPassword);

        User user = new User(
                userId, normalizedEmail, phoneE164, hash,
                birthdate, UserStatus.ACTIVE, now, now
        );
        userRepo.save(user);

        Persona eyes = new Persona(
                UUID.randomUUID(), userId, PersonaType.EYES, eyesPersonaId, null,
                null, null, null, BirthdateVisibility.NONE, true, now, now
        );
        personaRepo.save(eyes);

        Persona voices = new Persona(
                UUID.randomUUID(), userId, PersonaType.VOICES, voicesPersonaId, null,
                null, null, null, BirthdateVisibility.NONE, true, now, now
        );
        personaRepo.save(voices);
    }
}