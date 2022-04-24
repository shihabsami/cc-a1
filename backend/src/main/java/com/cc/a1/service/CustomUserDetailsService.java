package com.cc.a1.service;

import com.cc.a1.model.CustomUserDetails;
import com.cc.a1.model.User;
import com.cc.a1.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Implementation of the {@link UserDetailsService} for Spring Security.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;

    @Autowired
    public CustomUserDetailsService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    /**
     * Defines how users are to be loaded given username.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = usersRepository.findByUsername(username);
        user.orElseThrow(
                () -> new UsernameNotFoundException(String.format("User with email %s not found.", username)));
        return user.map(CustomUserDetails::new).get();
    }

}
