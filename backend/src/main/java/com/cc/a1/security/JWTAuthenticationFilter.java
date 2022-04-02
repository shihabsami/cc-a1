package com.cc.a1.security;

import com.cc.a1.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.cc.a1.security.SecurityConstants.AUTHORIZATION_HEADER;
import static com.cc.a1.security.SecurityConstants.JWT_SCHEME;

/**
 * Custom authentication filter for validating JWT tokens. To be run once before each request.
 */
@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private JWTTokenProvider tokenProvider;
    private CustomUserDetailsService userDetailsService;

    public JWTAuthenticationFilter() {
    }

    @Autowired
    public void setTokenProvider(JWTTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Autowired
    public void setUserDetailsService(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    /**
     * This method defines the actual filter logic.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);
        String username = null, jwt = null;

        // Validate token structure.
        if (authorizationHeader != null && authorizationHeader.startsWith(JWT_SCHEME)) {
            jwt = authorizationHeader.substring(JWT_SCHEME.length() + 1);
            username = tokenProvider.extractUsername(jwt);
        }

        // Validate token claims.
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (tokenProvider.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Notify Spring Security of the validity of the token to allow the request.
                SecurityContextHolder.getContext().setAuthentication(token);
            }
        }

        // Delegate call to the next filter in the filter chain.
        filterChain.doFilter(request, response);
    }

}
