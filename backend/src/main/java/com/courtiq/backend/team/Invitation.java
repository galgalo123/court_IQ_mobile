package com.courtiq.backend.team;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "invitations")
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 12)
    private String code;

    @Column(name = "team_id", nullable = false)
    private Long teamId;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean used;

    @Column(name = "used_by_user_id")
    private Long usedByUserId;

    public Invitation() {
    }

    public Invitation(String code, Long teamId, Instant expiresAt) {
        this.code = code;
        this.teamId = teamId;
        this.expiresAt = expiresAt;
        this.used = false;
    }

    public Long getId() { return id; }

    public String getCode() { return code; }

    public Long getTeamId() { return teamId; }

    public Instant getExpiresAt() { return expiresAt; }

    public boolean isUsed() { return used; }

    public Long getUsedByUserId() { return usedByUserId; }

    // Called when someone redeems the code, so it can't be used again.
    public void markUsed(Long userId) {
        this.used = true;
        this.usedByUserId = userId;
    }
}