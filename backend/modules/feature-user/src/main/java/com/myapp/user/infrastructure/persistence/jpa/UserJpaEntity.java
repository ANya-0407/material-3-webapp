package com.myapp.user.infrastructure.persistence.jpa;

import com.myapp.user.domain.User;
import com.myapp.user.domain.UserStatus;
import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;

@Entity
@Table(name = "users",
        indexes = {
                @Index(name = "uk_users_email", columnList = "email", unique = true),
                @Index(name = "uk_users_phone", columnList = "phone_e164", unique = true)
        })
public class UserJpaEntity {

    @Id
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false, length = 254)
    private String email;        // lower-case 保存

    @Column(name = "phone_e164", nullable = false, length = 32)
    private String phoneE164;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column
    private LocalDate birthdate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private UserStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected UserJpaEntity() {}

    public UserJpaEntity(UUID id, String email, String phoneE164, String passwordHash,
                         LocalDate birthdate, UserStatus status,
                         Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.email = email;
        this.phoneE164 = phoneE164;
        this.passwordHash = passwordHash;
        this.birthdate = birthdate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void prePersist() {
        if (email != null) email = email.toLowerCase(Locale.ROOT);
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = Instant.now(); }

    // getters/setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getPhoneE164() { return phoneE164; } public void setPhoneE164(String phoneE164) { this.phoneE164 = phoneE164; }
    public String getPasswordHash() { return passwordHash; } public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public LocalDate getBirthdate() { return birthdate; } public void setBirthdate(LocalDate birthdate) { this.birthdate = birthdate; }
    public UserStatus getStatus() { return status; } public void setStatus(UserStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; } public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static User toDomain(UserJpaEntity e) {
        return new User(e.id, e.email, e.phoneE164, e.passwordHash, e.birthdate, e.status, e.createdAt, e.updatedAt);
    }

    public static UserJpaEntity fromDomain(User u) {
        return new UserJpaEntity(u.id(), u.email(), u.phoneE164(), u.passwordHash(),
                u.birthdate(), u.status(), u.createdAt(), u.updatedAt());
    }
}