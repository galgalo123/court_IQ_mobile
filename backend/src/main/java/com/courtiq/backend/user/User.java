package com.courtiq.backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    // Kenyan mobile number in the form 254712345678. Unique, so one phone number is one account.
    @Column(unique = true, length = 20)
    private String phone;

    // The BCrypt hash, never the password itself.
    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false)
    private boolean approved;

    // Profile details, set when a player joins with a code.
    @Column(length = 10)
    private String gender;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Position position;

    // Stored in total inches, so 6'1" is 73.
    private Integer heightInches;

    private LocalDate dateOfBirth;

    public User() {
    }

    // Players are approved straight away. Staff wait for approval unless they're the team manager.
    public User(String name, String email, String phone, String passwordHash, Role role) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.passwordHash = passwordHash;
        this.role = role;
        this.approved = role == Role.PLAYER;
    }

    public void updateProfile(String gender, Position position, Integer heightInches, LocalDate dateOfBirth) {
        this.gender = gender;
        this.position = position;
        this.heightInches = heightInches;
        this.dateOfBirth = dateOfBirth;
    }

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getEmail() { return email; }

    public String getPhone() { return phone; }

    public String getPasswordHash() { return passwordHash; }

    public Role getRole() { return role; }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }

    public String getGender() { return gender; }

    public Position getPosition() { return position; }

    public Integer getHeightInches() { return heightInches; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
}