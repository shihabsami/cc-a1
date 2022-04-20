package com.cc.a1.service;

import com.cc.a1.exception.PostNotFoundException;
import com.cc.a1.model.Post;
import com.cc.a1.model.User;
import com.cc.a1.payload.GetPostsResponse;
import com.cc.a1.repository.PostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import static com.cc.a1.misc.Constants.PAGE_SIZE;

@Service
public class PostsService {

    private final PostsRepository postsRepository;
    private final UsersService usersService;

    @Autowired
    public PostsService(PostsRepository postsRepository,
                        UsersService usersService) {
        this.postsRepository = postsRepository;
        this.usersService = usersService;
    }

    public Post savePost(String text, String username) {
        User user = usersService.getUserByUsername(username);
        Post post = new Post();
        post.setText(text);
        post.setUser(user);
        return postsRepository.save(post);
    }

    public Post getPostById(long id) {
        return postsRepository.findById(id).orElseThrow(
                () -> new PostNotFoundException(String.format("Post by id %s not found\n", id)));
    }

    public GetPostsResponse getPosts(int page) {
        GetPostsResponse response = new GetPostsResponse();
        Page<Post> posts =
                postsRepository.findAll(PageRequest.of(page, PAGE_SIZE, Sort.by(Sort.Direction.DESC, "createdAt")));
        response.setPage(page);
        response.setHasMore(page < posts.getTotalPages() - 1);
        response.setPosts(posts.getContent());
        return response;
    }

}
