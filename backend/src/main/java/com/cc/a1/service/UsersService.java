package com.cc.a1.service;

import com.cc.a1.exception.UserNotFoundException;
import com.cc.a1.exception.UsernameAlreadyExistsException;
import com.cc.a1.model.User;
import com.cc.a1.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service layer for the {@link User} JPA entity.
 */
@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UsersService(UsersRepository usersRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Saves a new user into the database.
     */
    public User saveUser(User user) {
        if (usersRepository.existsByUsername(user.getUsername()))
            throw new UsernameAlreadyExistsException(
                    String.format("User by username %s already exists.", user.getUsername()));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return usersRepository.save(user);
    }

    /**
     * Get a user by their id.
     */
    public User getUserById(long id) {
        User user = usersRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException(String.format("User by id %d not found.", id)));

        // Prevent serialisation of sensitive fields.
        user.setPassword(null);
        return user;
    }

    /**
     * Get a user by their username.
     */
    public User getUserByUsername(String username) {
        User user = usersRepository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException(String.format("User by username %s not found\n", username)));

        // Prevent serialisation of sensitive fields.
        user.setPassword(null);
        return user;
    }

}
