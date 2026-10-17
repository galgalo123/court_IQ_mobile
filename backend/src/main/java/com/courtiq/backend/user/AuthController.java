package com.courtiq.backend.user;

import com.courtiq.backend.team.TeamMember;
import com.courtiq.backend.team.TeamMemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final TeamMemberRepository memberships;

    public AuthController(UserRepository users, PasswordEncoder passwordEncoder, TeamMemberRepository memberships) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.memberships = memberships;
    }

    // identifier is either an email address or a phone number.
    public record SignInRequest(String identifier, String password) {}

    public record SignInResponse(Long id, String name, String email, Role role, boolean approved,
                                 Long teamId, boolean manager, String gender, Position position,
                                 Integer heightInches, String height) {}

    @PostMapping("/sign-in")
    public ResponseEntity<?> signIn(@RequestBody SignInRequest request) {
        if (isBlank(request.identifier()) || isBlank(request.password())) {
            return ResponseEntity.badRequest().body("email or phone number and password are required");
        }

        String identifier = request.identifier().trim();
        User user = identifier.contains("@")
                ? users.findByEmail(identifier.toLowerCase()).orElse(null)
                : users.findByPhone(PhoneNumbers.normalize(identifier)).orElse(null);

        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("wrong email or phone number, or password");
        }

        TeamMember membership = memberships.findByUserId(user.getId()).stream().findFirst().orElse(null);
        if (membership == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("this account is not linked to a team yet");
        }

        Integer inches = user.getHeightInches();
        String height = inches == null ? null : (inches / 12) + "'" + (inches % 12);
        return ResponseEntity.ok(new SignInResponse(
                user.getId(), user.getName(), user.getEmail(), user.getRole(), user.isApproved(),
                membership.getTeamId(), membership.isManager(),
                user.getGender(), user.getPosition(), inches, height));
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}