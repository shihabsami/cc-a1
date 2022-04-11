package com.cc.a1.payload;

import com.cc.a1.exception.UserNotFoundException;
import lombok.Getter;
import lombok.Setter;

/**
 * The response payload to send {@link UserNotFoundException} is thrown.
 */
@Getter
@Setter
public class UserNotFoundResponse {

    private String user;

    public UserNotFoundResponse(String user) {
        this.user = user;
    }

}
