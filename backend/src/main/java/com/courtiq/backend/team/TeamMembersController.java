package com.courtiq.backend.team;

import com.courtiq.backend.user.Position;
import com.courtiq.backend.user.Role;
import com.courtiq.backend.user.User;
import com.courtiq.backend.user.UserRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams/{teamId}/members")
public class TeamMembersController {

    private final TeamMemberRepository memberships;
    private final UserRepository users;

    public TeamMembersController(TeamMemberRepository memberships, UserRepository users) {
        this.memberships = memberships;
        this.users = users;
    }

    public record MemberResponse(Long userId, String name, Role role, boolean manager, String gender,
                                 Position position, Integer heightInches, String height) {}

    // Everyone on the team. The manager is listed first, then members by name.
    @GetMapping
    public ResponseEntity<List<MemberResponse>> list(@PathVariable Long teamId) {
        List<MemberResponse> members = memberships.findByTeamId(teamId).stream()
                .map(row -> users.findById(row.getUserId())
                        .map(user -> toResponse(user, row.isManager()))
                        .orElse(null))
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(MemberResponse::manager, Comparator.reverseOrder())
                        .thenComparing(MemberResponse::name))
                .toList();
        return ResponseEntity.ok(members);
    }

    private static MemberResponse toResponse(User user, boolean manager) {
        Integer inches = user.getHeightInches();
        String height = inches == null ? null : (inches / 12) + "'" + (inches % 12);
        return new MemberResponse(user.getId(), user.getName(), user.getRole(), manager,
                user.getGender(), user.getPosition(), inches, height);
    }
}