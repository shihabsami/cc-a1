package com.cc.a1.service;

import com.cc.a1.exception.UserNotFoundException;
import com.cc.a1.exception.UsernameAlreadyExistsException;
import com.cc.a1.model.User;
import com.cc.a1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service layer for the {@link User} JPA entity.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Saves a new user into the database.
     */
    public User saveUser(User user) {
        if (userRepository.existsByUsername(user.getUsername()))
            throw new UsernameAlreadyExistsException(
                    String.format("User by username %s already exists.", user.getUsername()));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Get a user by their id.
     */
    public User getUserById(long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException(String.format("User by id %d not found.", id)));
    }

    /**
     * Get a user by their username.
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException(String.format("User by username %s not found\n", username)));
    }

}
