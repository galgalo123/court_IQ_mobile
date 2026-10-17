package com.courtiq.backend.user;

import java.time.LocalDate;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    private static final Set<String> GENDERS = Set.of("men", "women");
    private static final int MIN_HEIGHT_INCHES = 48; // 4 ft 0 in
    private static final int MAX_HEIGHT_INCHES = 96; // 8 ft 0 in

    private final UserRepository users;

    public ProfileController(UserRepository users) {
        this.users = users;
    }

    public record ProfileRequest(String gender, Position position, Integer heightInches, LocalDate dateOfBirth) {}

    public record ProfileResponse(Long id, String name, String gender, Position position,
                                  Integer heightInches, String height, LocalDate dateOfBirth) {}

    @PostMapping("/{id}/profile")
    public ResponseEntity<?> saveProfile(@PathVariable Long id, @RequestBody ProfileRequest request) {
        User user = users.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }
        if (request.gender() == null || !GENDERS.contains(request.gender())) {
            return ResponseEntity.badRequest().body("gender must be men or women");
        }
        if (request.position() == null) {
            return ResponseEntity.badRequest().body("position is required");
        }
        if (request.heightInches() == null
                || request.heightInches() < MIN_HEIGHT_INCHES
                || request.heightInches() > MAX_HEIGHT_INCHES) {
            return ResponseEntity.badRequest().body("height must be between 4'0 and 8'0");
        }
        if (request.dateOfBirth() != null && request.dateOfBirth().isAfter(LocalDate.now())) {
            return ResponseEntity.badRequest().body("date of birth cannot be in the future");
        }

        user.updateProfile(request.gender(), request.position(), request.heightInches(), request.dateOfBirth());
        return ResponseEntity.ok(toResponse(users.save(user)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        User user = users.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }
        return ResponseEntity.ok(toResponse(user));
    }

    // Converts 73 inches into "6'1" for display.
    private static ProfileResponse toResponse(User user) {
        Integer inches = user.getHeightInches();
        String height = inches == null ? null : (inches / 12) + "'" + (inches % 12);
        return new ProfileResponse(user.getId(), user.getName(), user.getGender(), user.getPosition(),
                inches, height, user.getDateOfBirth());
    }
}