package com.cc.a1.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a like is added for the same post by the same user.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class LikeAlreadyExistsException extends RuntimeException {

    public LikeAlreadyExistsException(String message) {
        super(message);
    }

}
