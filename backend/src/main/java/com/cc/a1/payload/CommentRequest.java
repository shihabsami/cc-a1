package com.cc.a1.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {

    private String text;
    private long postId;

}
