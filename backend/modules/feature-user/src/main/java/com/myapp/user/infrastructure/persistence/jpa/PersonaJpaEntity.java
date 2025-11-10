package com.myapp.user.infrastructure.persistence.jpa;

import com.myapp.user.domain.BirthdateVisibility;
import com.myapp.user.domain.Persona;
import com.myapp.user.domain.PersonaType;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Entity
@Table(name = "personas",
        indexes = {
                @Index(name = "uk_personas_user_type", columnList = "user_id,type", unique = true),
                @Index(name = "uk_personas_type_handle", columnList = "type,persona_id_norm", unique = true)
        })
public class PersonaJpaEntity {

    @Id
    @Column(nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private PersonaType type;

    @Column(name = "persona_id", nullable = false, length = 30)
    private String personaId;

    @Column(name = "persona_id_norm", nullable = false, length = 30)
    private String personaIdNorm;

    @Column(name = "persona_name", length = 50)
    private String personaName;

    @Column(name = "icon_url")
    private String iconUrl;

    @Column(name = "header_url")
    private String headerUrl;

    @Column(name = "bio", length = 1000)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(name = "birthdate_visibility", nullable = false, length = 16)
    private BirthdateVisibility birthdateVisibility;

    @Column(name = "active", nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected PersonaJpaEntity() {}

    public PersonaJpaEntity(UUID id, UUID userId, PersonaType type, String personaId, String personaIdNorm,
                            String personaName, String iconUrl, String headerUrl, String bio,
                            BirthdateVisibility birthdateVisibility, boolean active,
                            Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.personaId = personaId;
        this.personaIdNorm = personaIdNorm;
        this.personaName = personaName;
        this.iconUrl = iconUrl;
        this.headerUrl = headerUrl;
        this.bio = bio;
        this.birthdateVisibility = birthdateVisibility;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void prePersist() {
        if (personaId != null) personaIdNorm = personaId.toLowerCase(Locale.ROOT);
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        if (personaId != null) personaIdNorm = personaId.toLowerCase(Locale.ROOT);
        this.updatedAt = Instant.now();
    }

    // getters/setters (省略可)

    public static Persona toDomain(PersonaJpaEntity e) {
        return new Persona(e.id, e.userId, e.type, e.personaId, e.personaName,
                e.iconUrl, e.headerUrl, e.bio, e.birthdateVisibility, e.active, e.createdAt, e.updatedAt);
    }

    public static PersonaJpaEntity fromDomain(Persona p) {
        return new PersonaJpaEntity(p.id(), p.userId(), p.type(), p.personaId(),
                p.personaId() == null ? null : p.personaId().toLowerCase(Locale.ROOT),
                p.personaName(), p.iconUrl(), p.headerUrl(), p.bio(),
                p.birthdateVisibility(), p.active(), p.createdAt(), p.updatedAt());
    }
}