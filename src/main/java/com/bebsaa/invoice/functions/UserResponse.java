package com.bebsaa.invoice.functions;


public class UserResponse {
    private String userId;
    private String email;

    public UserResponse(String userId, String email) {
        this.userId = userId;
        this.email = email;
    }

    // Getters and Setters

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}