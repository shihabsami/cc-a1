package com.cc.a1.service;

import com.cc.a1.exception.PostNotFoundException;
import com.cc.a1.model.Post;
import com.cc.a1.model.User;
import com.cc.a1.repository.PostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostsService {

    private final PostsRepository postsRepository;
    private final UsersService usersService;

    @Autowired
    public PostsService(PostsRepository postsRepository, UsersService usersService) {
        this.postsRepository = postsRepository;
        this.usersService = usersService;
    }

    public Post savePost(Post post, String username) {
        User user = usersService.getUserByUsername(username);
        post.setUser(user);
        return postsRepository.save(post);
    }

    public Post getPostById(long id) {
        return postsRepository.findById(id).orElseThrow(
                () -> new PostNotFoundException(String.format("Post by id %s not found\n", id)));
    }

}
