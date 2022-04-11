package com.cc.a1.payload;

import com.cc.a1.exception.InvalidImageException;
import lombok.Getter;
import lombok.Setter;

/**
 * The response payload to send {@link InvalidImageException} is thrown.
 */
@Getter
@Setter
public class InvalidImageResponse {

    private String image;

    public InvalidImageResponse(String image) {
        this.image = image;
    }

}
