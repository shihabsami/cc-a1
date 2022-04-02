package com.cc.a1.security;

import java.util.concurrent.TimeUnit;

/**
 * Class to hold all the security configuration constants.
 */
public class SecurityConstants {

    public static final String AUTHORIZATION_HEADER = "Authorization";
    // TODO Secret key may need to be updated in the future. This is only for development.
    public static final String JWT_SECRET_KEY = "Am&s%7e6z^zN^vMRc9*h#J$chiR9#$6yE^&Qq2863C$tc@u66*DsbCZ&Dp9@LtQe";
    public static final String JWT_SCHEME = "Bearer";
    public static final long JWT_EXPIRATION_TIME_MILLIS = TimeUnit.HOURS.toMillis(24);

}
