package com.cc.a1.exception;

/**
 * Thrown when a like is added for the same post by the same user.
 */
public class LikeAlreadyExistsException extends RuntimeException {

    public LikeAlreadyExistsException(String message) {
        super(message);
    }

}
