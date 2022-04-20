package com.cc.a1.exception;

/**
 * Thrown when a requested post could not be found.
 */
public class PostNotFoundException extends RuntimeException {

    public PostNotFoundException(String message) {
        super(message);
    }

}
