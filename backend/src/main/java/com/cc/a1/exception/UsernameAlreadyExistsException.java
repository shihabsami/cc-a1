package com.cc.a1.exception;

/**
 * Thrown when a user registration is requested with an existing username.
 */
public class UsernameAlreadyExistsException extends RuntimeException {

    public UsernameAlreadyExistsException(String message) {
        super(message);
    }

}
