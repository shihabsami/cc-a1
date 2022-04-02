package com.cc.a1.payload;

import lombok.Getter;
import lombok.Setter;

/**
 * The response payload to send when authentication fails.
 */
@Getter
@Setter
public class InvalidLoginResponse {

    private String username;
    private String password;

    public InvalidLoginResponse() {
        this.username = "Invalid username.";
        this.password = "Invalid password.";
    }

}
