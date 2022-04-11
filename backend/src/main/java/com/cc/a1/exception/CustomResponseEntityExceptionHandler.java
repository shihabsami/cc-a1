package com.cc.a1.exception;

import com.cc.a1.payload.InvalidImageResponse;
import com.cc.a1.payload.PostNotFoundResponse;
import com.cc.a1.payload.UserNotFoundResponse;
import com.cc.a1.payload.UsernameAlreadyExistsResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Controller to perform Spring based exception handling.
 */
@ControllerAdvice
public class CustomResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler
    public final ResponseEntity<?> handleUsernameAlreadyExists(UsernameAlreadyExistsException exception) {
        UsernameAlreadyExistsResponse exceptionResponse = new UsernameAlreadyExistsResponse(exception.getMessage());
        return new ResponseEntity<>(exceptionResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public final ResponseEntity<?> handleUserNotFound(UserNotFoundException exception) {
        UserNotFoundResponse exceptionResponse = new UserNotFoundResponse(exception.getMessage());
        return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public final ResponseEntity<?> handlePostNotFound(PostNotFoundException exception) {
        PostNotFoundResponse exceptionResponse = new PostNotFoundResponse(exception.getMessage());
        return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public final ResponseEntity<?> handleInvalidImage(InvalidImageException exception) {
        InvalidImageResponse exceptionResponse = new InvalidImageResponse(exception.getMessage());
        return new ResponseEntity<>(exceptionResponse, HttpStatus.BAD_REQUEST);
    }

}
