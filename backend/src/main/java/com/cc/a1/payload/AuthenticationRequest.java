package com.cc.a1.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

/**
 * The request payload expected for authentication.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {

    @NotBlank(message = "Username cannot be blank.")
    private String username;

    @NotBlank(message = "Password cannot be blank.")
    private String password;

}
