package com.courtiq.backend.team;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // "MEN" or "WOMEN"
    @Column(nullable = false, length = 10)
    private String gender;

    // The league code from the app, for example "kbf-premier-men"
    @Column(nullable = false)
    private String leagueId;

    private String city;

    private String homeVenue;

    // JPA needs a constructor with no arguments.
    public Team() {
    }

    public Team(String name, String gender, String leagueId, String city, String homeVenue) {
        this.name = name;
        this.gender = gender;
        this.leagueId = leagueId;
        this.city = city;
        this.homeVenue = homeVenue;
    }

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getLeagueId() { return leagueId; }
    public void setLeagueId(String leagueId) { this.leagueId = leagueId; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getHomeVenue() { return homeVenue; }
    public void setHomeVenue(String homeVenue) { this.homeVenue = homeVenue; }
}