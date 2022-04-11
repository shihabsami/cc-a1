package com.cc.a1.security;

import com.cc.a1.payload.InvalidLoginResponse;
import com.google.gson.Gson;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Implementation of the {@link AuthenticationEntryPoint} to handle the response for unauthorised requests.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    /*
     * This method is invoked on receiving an unauthorised request.
     */
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException exception) throws IOException {


        // Convert the response payload into JSON.
        InvalidLoginResponse loginResponse = new InvalidLoginResponse();
        String jsonLoginResponse = new Gson().toJson(loginResponse);

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().print(jsonLoginResponse);
    }

}
