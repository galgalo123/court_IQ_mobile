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

    public TeamController(TeamRepository teams) {
        this.teams = teams;
    }

    // The JSON the app sends when a team is created.
    public record TeamRequest(String name, String gender, String leagueId, String city, String homeVenue) {}

    @PostMapping
    public ResponseEntity<Team> create(@RequestBody TeamRequest request) {
        boolean validGender = "men".equals(request.gender()) || "women".equals(request.gender());
        if (request.name() == null || request.name().isBlank() || !validGender
                || request.leagueId() == null || request.leagueId().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Team saved = teams.save(new Team(
                request.name().trim(), request.gender(), request.leagueId(), request.city(), request.homeVenue()));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> get(@PathVariable Long id) {
        return teams.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}