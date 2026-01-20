package com.example.dishcovery.dto;

public class AuthDtos {

    // --- Request for registration ---
    public static class RegisterRequest {
        private String username;
        private String password;
        private String avatarUrl; // optional

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }

    // --- Request for login ---
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // --- User profile (response) ---
    public static class Profile {
        private Long id;
        private String username;
        private String avatarUrl;

        public Profile(Long id, String username, String avatarUrl) {
            this.id = id;
            this.username = username;
            this.avatarUrl = avatarUrl;
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getAvatarUrl() { return avatarUrl; }
    }

    // --- Authentication response ---
    public static class AuthResponse {
        private boolean ok;
        private String message;
        private String token;
        private Profile profile;

        public static AuthResponse ok(String token, Profile profile) {
            AuthResponse r = new AuthResponse();
            r.ok = true;
            r.token = token;
            r.profile = profile;
            return r;
        }

        public static AuthResponse error(String msg) {
            AuthResponse r = new AuthResponse();
            r.ok = false;
            r.message = msg;
            return r;
        }

        public boolean isOk() { return ok; }
        public String getMessage() { return message; }
        public String getToken() { return token; }
        public Profile getProfile() { return profile; }
    }
}
