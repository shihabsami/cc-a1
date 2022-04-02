package com.cc.a1.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Configures the password encoder bean.
 */
@Configuration
public class PasswordEncoder {

    /**
     * This Bean defines how to instantiate the BCrypt password encoder.
     */
    @Bean
    public BCryptPasswordEncoder bcryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
