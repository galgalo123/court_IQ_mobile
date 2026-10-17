package com.courtiq.backend.onboarding;

import com.courtiq.backend.team.Invitation;
import com.courtiq.backend.team.InvitationCodes;
import com.courtiq.backend.team.InvitationRepository;
import com.courtiq.backend.team.Team;
import com.courtiq.backend.team.TeamMember;
import com.courtiq.backend.team.TeamMemberRepository;
import com.courtiq.backend.team.TeamRepository;
import com.courtiq.backend.user.PhoneNumbers;
import com.courtiq.backend.user.Position;
import com.courtiq.backend.user.Role;
import com.courtiq.backend.user.User;
import com.courtiq.backend.user.UserRepository;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private static final Duration CODE_VALIDITY = Duration.ofDays(7);
    private static final Set<String> GENDERS = Set.of("men", "women");
    private static final Set<Role> STAFF_ROLES = Set.of(Role.STATISTICIAN, Role.COACH, Role.MEDICAL);
    private static final int MIN_HEIGHT_INCHES = 48; // 4 ft 0 in
    private static final int MAX_HEIGHT_INCHES = 96; // 8 ft 0 in

    private final UserRepository users;
    private final TeamRepository teams;
    private final TeamMemberRepository memberships;
    private final InvitationRepository invitations;
    private final PasswordEncoder passwordEncoder;

    public OnboardingController(UserRepository users, TeamRepository teams, TeamMemberRepository memberships,
                                InvitationRepository invitations, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.teams = teams;
        this.memberships = memberships;
        this.invitations = invitations;
        this.passwordEncoder = passwordEncoder;
    }

    public record ManagerRequest(String name, String email, String phone, String password, String role,
                                 String teamName, String gender, String leagueId, String city, String homeVenue) {}

    public record TeamResponse(Long id, String name, String gender, String leagueId, String city, String homeVenue) {}

    public record ManagerResponse(Long userId, String name, String email, String role, TeamResponse team,
                                  String code, Instant expiresAt) {}

    public record JoinRequest(String code, String name, String email, String phone, String password, String role,
                              String gender, String position, Integer heightInches, LocalDate dateOfBirth) {}

    public record JoinResponse(Long userId, String name, String email, String role, boolean approved,
                               TeamResponse team) {}

    public record CodePreview(boolean valid, String reason, String teamName, String gender, String leagueId) {}

    // Creates the manager's account, their team, their membership and the team code, all at once.
    @PostMapping("/manager")
    @Transactional
    public ResponseEntity<?> registerManager(@RequestBody ManagerRequest r) {
        String problem = accountProblem(r.name(), r.email(), r.phone(), r.password());
        if (problem != null) return badRequest(problem);

        Role role = parseRole(r.role());
        if (role == null || !STAFF_ROLES.contains(role)) {
            return badRequest("the team manager must be a Statistician, Coach or Medical staff member");
        }
        if (isBlank(r.teamName())) return badRequest("team name is required");
        if (!isGender(r.gender())) return badRequest("gender must be men or women");
        if (isBlank(r.leagueId())) return badRequest("league is required");

        String email = r.email().trim().toLowerCase();
        String phone = PhoneNumbers.normalize(r.phone());
        if (users.existsByEmail(email)) return conflict("an account with this email already exists");
        if (users.existsByPhone(phone)) return conflict("an account with this phone number already exists");

        User user = new User(r.name().trim(), email, phone, passwordEncoder.encode(r.password()), role);
        user.setApproved(true); // the manager created the team, so nobody needs to approve them
        user = users.save(user);

        Team team = teams.save(new Team(r.teamName().trim(), r.gender(), r.leagueId().trim(),
                blankToNull(r.city()), blankToNull(r.homeVenue())));
        memberships.save(new TeamMember(user.getId(), team.getId(), true));

        Instant expires = Instant.now().plus(CODE_VALIDITY);
        Invitation invitation = invitations.save(new Invitation(InvitationCodes.create(), team.getId(), expires));

        return ResponseEntity.status(HttpStatus.CREATED).body(new ManagerResponse(
                user.getId(), user.getName(), user.getEmail(), role.name(), toTeam(team),
                invitation.getCode(), expires));
    }

    // Shows the team a code belongs to, so the person can confirm it before joining.
    @GetMapping("/invitations/{code}")
    public ResponseEntity<CodePreview> preview(@PathVariable String code) {
        Invitation invitation = invitations.findByCode(code.trim().toUpperCase()).orElse(null);
        if (invitation == null) {
            return ResponseEntity.ok(new CodePreview(false, "team code not found", null, null, null));
        }
        if (Instant.now().isAfter(invitation.getExpiresAt())) {
            return ResponseEntity.ok(new CodePreview(false, "this team code has expired", null, null, null));
        }
        Team team = teams.findById(invitation.getTeamId()).orElse(null);
        if (team == null) {
            return ResponseEntity.ok(new CodePreview(false, "the team for this code no longer exists", null, null, null));
        }
        return ResponseEntity.ok(new CodePreview(true, null, team.getName(), team.getGender(), team.getLeagueId()));
    }

    // Creates an account and adds it to the team behind the code. Players also save their profile.
    @PostMapping("/join")
    @Transactional
    public ResponseEntity<?> join(@RequestBody JoinRequest r) {
        if (isBlank(r.code())) return badRequest("team code is required");
        String problem = accountProblem(r.name(), r.email(), r.phone(), r.password());
        if (problem != null) return badRequest(problem);

        Role role = parseRole(r.role());
        if (role == null) return badRequest("role must be STATISTICIAN, PLAYER, COACH or MEDICAL");

        Invitation invitation = invitations.findByCode(r.code().trim().toUpperCase()).orElse(null);
        if (invitation == null) return notFound("team code not found");
        if (Instant.now().isAfter(invitation.getExpiresAt())) return gone("this team code has expired");

        Position position = null;
        if (role == Role.PLAYER) {
            if (!isGender(r.gender())) return badRequest("gender must be men or women");
            position = parsePosition(r.position());
            if (position == null) return badRequest("choose a valid position");
            if (r.heightInches() == null || r.heightInches() < MIN_HEIGHT_INCHES || r.heightInches() > MAX_HEIGHT_INCHES) {
                return badRequest("height must be between 4'0 and 8'0");
            }
            if (r.dateOfBirth() != null && r.dateOfBirth().isAfter(LocalDate.now())) {
                return badRequest("date of birth cannot be in the future");
            }
        }

        String email = r.email().trim().toLowerCase();
        String phone = PhoneNumbers.normalize(r.phone());
        if (users.existsByEmail(email)) return conflict("an account with this email already exists");
        if (users.existsByPhone(phone)) return conflict("an account with this phone number already exists");

        User user = new User(r.name().trim(), email, phone, passwordEncoder.encode(r.password()), role);
        if (role == Role.PLAYER) {
            user.updateProfile(r.gender(), position, r.heightInches(), r.dateOfBirth());
        }
        user = users.save(user);
        memberships.save(new TeamMember(user.getId(), invitation.getTeamId(), false));

        Team team = teams.findById(invitation.getTeamId()).orElse(null);
        if (team == null) return notFound("the team for this code no longer exists");

        return ResponseEntity.status(HttpStatus.CREATED).body(new JoinResponse(
                user.getId(), user.getName(), user.getEmail(), role.name(), user.isApproved(), toTeam(team)));
    }

    private String accountProblem(String name, String email, String phone, String password) {
        if (isBlank(name)) return "name is required";
        if (isBlank(email) || !email.contains("@")) return "a valid email address is required";
        if (!PhoneNumbers.isValid(PhoneNumbers.normalize(phone))) {
            return "enter a valid Kenyan phone number, for example 0712 345 678";
        }
        if (isBlank(password) || password.length() < 8) return "password must be at least 8 characters";
        return null;
    }

    private static Role parseRole(String raw) {
        if (isBlank(raw)) return null;
        try {
            return Role.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private static Position parsePosition(String raw) {
        if (isBlank(raw)) return null;
        try {
            return Position.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private static boolean isGender(String gender) {
        return gender != null && GENDERS.contains(gender);
    }

    private static TeamResponse toTeam(Team team) {
        return new TeamResponse(team.getId(), team.getName(), team.getGender(), team.getLeagueId(),
                team.getCity(), team.getHomeVenue());
    }

    private static ResponseEntity<String> badRequest(String message) {
        return ResponseEntity.badRequest().body(message);
    }

    private static ResponseEntity<String> conflict(String message) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
    }

    private static ResponseEntity<String> notFound(String message) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
    }

    private static ResponseEntity<String> gone(String message) {
        return ResponseEntity.status(HttpStatus.GONE).body(message);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}