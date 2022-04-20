package com.cc.a1.exception;

/**
 * Thrown when an image (multipart/form-data) is invalid.
 */
public class InvalidImageException extends RuntimeException {

    public InvalidImageException(String message) {
        super(message);
    }

}
