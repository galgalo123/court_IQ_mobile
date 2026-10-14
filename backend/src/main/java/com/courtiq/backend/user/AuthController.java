package com.courtiq.backend.user;

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

    public AuthController(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    // The JSON the app sends when someone signs up.
    public record SignUpRequest(String name, String email, String password, String role) {}

    // The only user details sent back. The password hash is never included.
    public record UserResponse(Long id, String name, String email, Role role, boolean approved) {}

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest request) {
        // 1. Required fields
        if (isBlank(request.name()) || isBlank(request.email())
                || isBlank(request.password()) || isBlank(request.role())) {
            return ResponseEntity.badRequest().body("name, email, password and role are required");
        }

        String name = request.name().trim();
        String email = request.email().trim().toLowerCase();

        // 2. Email format
        if (!email.contains("@")) {
            return ResponseEntity.badRequest().body("email is not valid");
        }

        // 3. Password length
        if (request.password().length() < 8) {
            return ResponseEntity.badRequest().body("password must be at least 8 characters");
        }

        // 4. Role
        Role role;
        try {
            role = Role.valueOf(request.role().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("role must be STATISTICIAN, PLAYER, COACH or MEDICAL");
        }

        // 5. Duplicate email
        if (users.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("an account with this email already exists");
        }

        // 6. Save the user, with the password hashed
        User saved = users.save(new User(name, email, passwordEncoder.encode(request.password()), role));

        // 7. Send back safe fields only
        UserResponse response = new UserResponse(
                saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(), saved.isApproved());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}