package com.courtiq.backend.user;

public final class PhoneNumbers {

    private PhoneNumbers() {
    }

    // Turns 0712 345 678, +254 712 345 678 or 254712345678 into 254712345678.
    public static String normalize(String raw) {
        if (raw == null) return null;
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.length() == 10 && digits.startsWith("0")) {
            digits = "254" + digits.substring(1);
        }
        return digits;
    }

    // Kenyan mobile numbers: 254, then 7 or 1, then eight more digits.
    public static boolean isValid(String normalized) {
        return normalized != null && normalized.matches("^254[17][0-9]{8}$");
    }
}