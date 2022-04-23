package com.cc.a1.security;

import com.cc.a1.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Single source of configuration for Spring Security.
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        prePostEnabled = true
)
public class SecurityConfigurer extends WebSecurityConfigurerAdapter {

    private CustomUserDetailsService userDetailsService;
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public void setUserDetailsService(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Autowired
    public void setJwtAuthenticationEntryPoint(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Autowired
    public void setJwtAuthenticationFilter(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Autowired
    public void setBCryptPasswordEncoder(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    /*
     * Spring Security requires this very specific override of this method. Do not modify.
     */
    @Override
    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    /**
     * Configures the authentication manager to use the custom implementation of the {@link UserDetailsService}.
     * And the previously Autowired BCrypt password encoder as the default password encoder.
     */
    @Override
    protected void configure(AuthenticationManagerBuilder builder) throws Exception {
        builder.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
    }

    /**
     * Configures all HTTP communication.
     */
    @Override
    protected void configure(HttpSecurity security) throws Exception {
        security.httpBasic().and().cors().and().csrf().disable().exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().headers().frameOptions().sameOrigin()
                .and().authorizeRequests()
                .antMatchers(
                        "/",
                        "/favicon.ico",
                        "/**/*.png",
                        "/**/*.gif",
                        "/**/*.svg",
                        "/**/*.jpg",
                        "/**/*.html",
                        "/**/*.css",
                        "/**/*.js").permitAll()
                .antMatchers("/health").permitAll()
                .antMatchers("/api/users/register").permitAll()
                .antMatchers("/api/users/authenticate").permitAll()
                .antMatchers("/api/posts").authenticated()
                .antMatchers("/api/posts/**").authenticated()
                .antMatchers("/api/images/**").authenticated()
                .antMatchers("/api/likes").permitAll()
                .antMatchers("/api/likes/**").authenticated()
                .antMatchers("/api/comments").permitAll()
                .antMatchers("/api/comments/**").authenticated()
                .anyRequest().authenticated();

        // Configure the JWT authentication filter to run before processing every HTTP request.
        security.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    }

}
