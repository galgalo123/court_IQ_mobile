package com.courtiq.backend.team;

import java.security.SecureRandom;

public final class InvitationCodes {

    // Letters and digits, without the easily confused 0, O, 1 and I.
    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();

    private InvitationCodes() {
    }

    public static String create() {
        StringBuilder code = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) {
            code.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return code.toString();
    }
}