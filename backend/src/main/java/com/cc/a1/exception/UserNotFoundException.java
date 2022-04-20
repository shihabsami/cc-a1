package com.cc.a1.exception;

/**
 * Thrown when a requested user could not be found.
 */
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String message) {
        super(message);
    }

}
