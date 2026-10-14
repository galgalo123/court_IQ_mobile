package com.courtiq.backend.team;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "team_members",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "team_id"}))
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "team_id", nullable = false)
    private Long teamId;

    // True for the team's manager. Only the manager can create invitation codes and approve staff.
    @Column(nullable = false)
    private boolean manager;

    public TeamMember() {
    }

    public TeamMember(Long userId, Long teamId, boolean manager) {
        this.userId = userId;
        this.teamId = teamId;
        this.manager = manager;
    }

    public Long getId() { return id; }

    public Long getUserId() { return userId; }

    public Long getTeamId() { return teamId; }

    public boolean isManager() { return manager; }
    public void setManager(boolean manager) { this.manager = manager; }
}