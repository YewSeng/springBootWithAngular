package com.caltech.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private boolean authenticated;
    private Object userDetails;
    
    public AuthResponse(boolean authenticated, UserBase userBase) {
        this.authenticated = authenticated;
        this.userDetails = userBase;
    }

    public AuthResponse(boolean authenticated, Driver driver) {
        this.authenticated = authenticated;
        this.userDetails = driver;
    }

    public AuthResponse(boolean authenticated, Admin admin) {
        this.authenticated = authenticated;
        this.userDetails = admin;
    }
}

