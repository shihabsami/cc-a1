package com.cc.a1.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static com.cc.a1.security.SecurityConstants.JWT_EXPIRATION_TIME_MILLIS;
import static com.cc.a1.security.SecurityConstants.JWT_SECRET_KEY;


/**
 * Utility class to handle JWT token related operations.
 */
@Component
public class JWTTokenProvider {

    /**
     * Extract username (subject) from the token payload.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract expiration from the token payload.
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Generic method to extract a certain type of claim from the token payload.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Method to extract all claims from the token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(JWT_SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                   .build().parseClaimsJws(token).getBody();
    }

    /**
     * Determine whether a token is expired.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Create a new token with user details.
     */
    public String createToken(UserDetails userDetails) {
        String username = userDetails.getUsername();
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        return Jwts.builder()
                   .setClaims(claims)
                   .setSubject(username)
                   .setIssuedAt(new Date())
                   .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_TIME_MILLIS))
                   /*
                    * TODO
                    *  Can opt for a stronger key in the future.
                    *  SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
                    *  And save the String representation in a file.
                    *  String secretString = Encoders.BASE64.encode(key.getEncoded());
                    */
                   .signWith(Keys.hmacShaKeyFor(JWT_SECRET_KEY.getBytes(StandardCharsets.UTF_8)),
                             SignatureAlgorithm.HS512)
                   .compact();
    }

    /**
     * Validate token claims and expiration.
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception exception) {
            System.err.println(exception.getMessage());
        }

        return false;
    }

}
