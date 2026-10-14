package com.courtiq.backend.team;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamRepository teams;
    private final TeamMemberRepository memberships;

    public TeamController(TeamRepository teams, TeamMemberRepository memberships) {
        this.teams = teams;
        this.memberships = memberships;
    }

    // managerUserId is the person creating the team. They become its manager.
    public record TeamRequest(String name, String gender, String leagueId, String city, String homeVenue, Long managerUserId) {}

    @PostMapping
    public ResponseEntity<?> create(@RequestBody TeamRequest request) {
        boolean validGender = "men".equals(request.gender()) || "women".equals(request.gender());
        if (request.name() == null || request.name().isBlank()
                || request.leagueId() == null || request.leagueId().isBlank()) {
            return ResponseEntity.badRequest().body("name and leagueId are required");
        }
        if (!validGender) {
            return ResponseEntity.badRequest().body("gender must be men or women");
        }
        if (request.managerUserId() == null) {
            return ResponseEntity.badRequest().body("managerUserId is required");
        }

        Team saved = teams.save(new Team(
                request.name().trim(), request.gender(), request.leagueId(), request.city(), request.homeVenue()));
        memberships.save(new TeamMember(request.managerUserId(), saved.getId(), true));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> get(@PathVariable Long id) {
        return teams.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}