package com.cc.a1.payload;

import com.cc.a1.model.User;
import lombok.Getter;
import lombok.Setter;

/**
 * The response payload to send when authentication succeeds.
 */
@Getter
@Setter
public class AuthenticationResponse {

    private User user;
    private String jwt;

    // Default constructor is needed. Do not delete.
    public AuthenticationResponse() {
    }

    public AuthenticationResponse(User user, String jwt) {
        this.user = user;
        this.jwt = jwt;
    }

}
