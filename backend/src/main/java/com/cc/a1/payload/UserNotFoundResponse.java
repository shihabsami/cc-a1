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

    private String id;

    public UserNotFoundResponse(String field) {
        this.id = field;
    }

}
