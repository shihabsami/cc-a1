package com.cc.a1.payload;

import com.cc.a1.exception.UsernameAlreadyExistsException;
import lombok.Getter;
import lombok.Setter;

/**
 * The response payload to send {@link UsernameAlreadyExistsException} is thrown.
 */
@Getter
@Setter
public class LikeAlreadyExistsResponse {

    private String like;

    public LikeAlreadyExistsResponse(String like) {
        this.like = like;
    }

}
