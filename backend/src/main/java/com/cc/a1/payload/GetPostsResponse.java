package com.cc.a1.payload;

import com.cc.a1.model.Post;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GetPostsResponse {

    private int page;
    private boolean hasMore;
    private List<Post> posts;

}
