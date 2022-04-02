package com.cc.a1.payload;

import com.cc.a1.exception.UsernameAlreadyExistsException;
import lombok.Getter;
import lombok.Setter;

/**
 * The response payload to send {@link UsernameAlreadyExistsException} is thrown.
 */
@Getter
@Setter
public class UsernameAlreadyExistsResponse {

    private String username;

    public UsernameAlreadyExistsResponse(String username) {
        this.username = username;
    }

}
