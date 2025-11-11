package com.myapp.relation.infrastructure.persistence.jpa.persona;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "personas",
        indexes = {
                @Index(name = "idx_personas_type_handle", columnList = "type,persona_id")
        })
public class PersonaRefJpaEntity {

    @Id
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false, length = 16)
    private String type; // 'EYES' or 'VOICES'

    @Column(name = "persona_id", nullable = false, length = 30)
    private String personaId;

    @Column(name = "persona_name", length = 50)
    private String personaName;

    @Column(name = "icon_url")
    private String iconUrl;

    @Column(name = "header_url")
    private String headerUrl;

    protected PersonaRefJpaEntity() {}

    public UUID getId() { return id; }
    public String getType() { return type; }
    public String getPersonaId() { return personaId; }
    public String getPersonaName() { return personaName; }
    public String getIconUrl() { return iconUrl; }
    public String getHeaderUrl() { return headerUrl; }
}