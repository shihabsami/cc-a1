package com.cc.a1.payload;

import com.cc.a1.exception.PostNotFoundException;
import lombok.Getter;
import lombok.Setter;

/**
 * The response payload to send {@link PostNotFoundException} is thrown.
 */
@Getter
@Setter
public class PostNotFoundResponse {

    private String post;

    public PostNotFoundResponse(String post) {
        this.post = post;
    }

}
