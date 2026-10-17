package com.courtiq.backend.user;

public enum Position {
    POINT_GUARD("Point guard"),
    SHOOTING_GUARD("Shooting guard"),
    SMALL_FORWARD("Small forward"),
    POWER_FORWARD("Power forward"),
    CENTRE("Centre");

    private final String label;

    Position(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}