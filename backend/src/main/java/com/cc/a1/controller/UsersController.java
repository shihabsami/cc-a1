package com.cc.a1.controller;

import com.cc.a1.exception.UserNotFoundException;
import com.cc.a1.model.User;
import com.cc.a1.payload.AuthenticationRequest;
import com.cc.a1.payload.AuthenticationResponse;
import com.cc.a1.security.JwtUtility;
import com.cc.a1.service.CustomUserDetailsService;
import com.cc.a1.service.UsersService;
import com.cc.a1.service.ValidationErrorService;
import com.cc.a1.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UsersService usersService;
    private final CustomUserDetailsService userDetailsService;
    private final UserValidator userValidator;
    private final ValidationErrorService validationErrorService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtility jwtUtility;

    @Autowired
    public UsersController(UsersService usersService,
                           CustomUserDetailsService userDetailsService,
                           UserValidator userValidator,
                           ValidationErrorService validationErrorService,
                           AuthenticationManager authenticationManager,
                           JwtUtility jwtUtility) {
        this.usersService = usersService;
        this.userDetailsService = userDetailsService;
        this.userValidator = userValidator;
        this.validationErrorService = validationErrorService;
        this.authenticationManager = authenticationManager;
        this.jwtUtility = jwtUtility;
    }

    /**
     * Register a new user.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, BindingResult result) {
        // Only perform custom validation once the basic validations pass.
        if (!result.hasErrors())
            userValidator.validate(user, result);

        ResponseEntity<?> errorMap = validationErrorService.mapValidationErrors(result);
        if (errorMap != null)
            return errorMap;

        user = usersService.saveUser(user);
        String jwt = jwtUtility.createToken(userDetailsService.loadUserByUsername(user.getUsername()));
        return new ResponseEntity<>(new AuthenticationResponse(user, jwt), HttpStatus.CREATED);
    }

    /**
     * Login an existing user.
     */
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthenticationRequest authenticationRequest,
                                              BindingResult result) {
        ResponseEntity<?> errorMap = validationErrorService.mapValidationErrors(result);
        if (errorMap != null)
            return errorMap;

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                authenticationRequest.getUsername(),
                authenticationRequest.getPassword()
        ));

        String jwt = jwtUtility.createToken(
                userDetailsService.loadUserByUsername(authenticationRequest.getUsername()));
        return new ResponseEntity<>(new AuthenticationResponse(
                usersService.getUserByUsername(authenticationRequest.getUsername()), jwt), HttpStatus.OK);
    }

    /**
     * Get the currently authenticated user.
     */
    @GetMapping("/getAuthenticated")
    public ResponseEntity<?> getAuthenticated() throws UserNotFoundException {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return new ResponseEntity<>(usersService.getUserByUsername(userDetails.getUsername()), HttpStatus.OK);
    }

    /**
     * Get a user by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable long id) throws UserNotFoundException {
        return new ResponseEntity<>(usersService.getUserById(id), HttpStatus.OK);
    }

}
