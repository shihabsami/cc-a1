package com.cc.a1.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when an image (multipart/form-data) is invalid.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidImageException extends RuntimeException {

    public InvalidImageException(String message) {
        super(message);
    }

}
