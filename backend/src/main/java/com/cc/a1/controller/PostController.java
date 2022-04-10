package com.cc.a1.controller;

import com.cc.a1.model.Post;
import com.cc.a1.repository.PostsRepository;
import com.cc.a1.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostsRepository postsRepository;
    private final UsersRepository usersRepository;

    @Autowired
    public PostController(PostsRepository postsRepository, UsersRepository usersRepository) {
        this.postsRepository = postsRepository;
        this.usersRepository = usersRepository;
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Post post) {
        post.setUser(usersRepository.getById(post.getUser().getId()));
        postsRepository.save(post);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
