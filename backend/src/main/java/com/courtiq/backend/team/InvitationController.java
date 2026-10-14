package com.courtiq.backend.team;

import com.courtiq.backend.user.User;
import com.courtiq.backend.user.UserRepository;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class InvitationController {

    // Letters and digits, without the easily confused characters 0, O, 1 and I.
    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 8;
    private static final Duration VALIDITY = Duration.ofDays(7);

    private final SecureRandom random = new SecureRandom();
    private final InvitationRepository invitations;
    private final TeamMemberRepository memberships;
    private final UserRepository users;

    public InvitationController(InvitationRepository invitations, TeamMemberRepository memberships, UserRepository users) {
        this.invitations = invitations;
        this.memberships = memberships;
        this.users = users;
    }

    // managerUserId stands in for a login token until authentication is added.
    public record CreateInvitationRequest(Long managerUserId) {}

    public record InvitationResponse(String code, Long teamId, Instant expiresAt) {}

    public record RedeemRequest(String code, Long userId) {}

    public record RedeemResponse(Long teamId, Long userId, boolean manager) {}

    @PostMapping("/teams/{teamId}/invitations")
    public ResponseEntity<?> create(@PathVariable Long teamId, @RequestBody CreateInvitationRequest request) {
        if (request.managerUserId() == null) {
            return ResponseEntity.badRequest().body("managerUserId is required");
        }
        if (!memberships.existsByUserIdAndTeamIdAndManagerTrue(request.managerUserId(), teamId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("only the team manager can create invitations");
        }

        Invitation invitation = invitations.save(new Invitation(newCode(), teamId, Instant.now().plus(VALIDITY)));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new InvitationResponse(invitation.getCode(), teamId, invitation.getExpiresAt()));
    }

    @PostMapping("/invitations/redeem")
    public ResponseEntity<?> redeem(@RequestBody RedeemRequest request) {
        if (request.code() == null || request.code().isBlank() || request.userId() == null) {
            return ResponseEntity.badRequest().body("code and userId are required");
        }

        User user = users.findById(request.userId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }

        Invitation invitation = invitations.findByCode(request.code().trim().toUpperCase()).orElse(null);
        if (invitation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("invitation code not found");
        }
        if (invitation.isUsed()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("this code has already been used");
        }
        if (Instant.now().isAfter(invitation.getExpiresAt())) {
            return ResponseEntity.status(HttpStatus.GONE).body("this code has expired");
        }
        if (memberships.existsByUserIdAndTeamId(user.getId(), invitation.getTeamId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("you are already a member of this team");
        }

        // Joining as a member, never as manager. Only the team creator is the manager.
        memberships.save(new TeamMember(user.getId(), invitation.getTeamId(), false));
        invitation.markUsed(user.getId());
        invitations.save(invitation);

        return ResponseEntity.ok(new RedeemResponse(invitation.getTeamId(), user.getId(), false));
    }

    // Eight random characters from CODE_CHARS, for example "K7QF2M9T".
    private String newCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
        }
        return code.toString();
    }
}