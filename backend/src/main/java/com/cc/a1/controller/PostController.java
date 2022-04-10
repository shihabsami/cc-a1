package com.cc.a1.controller;

import com.cc.a1.model.Post;
import com.cc.a1.repository.PostsRepository;
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

    @Autowired
    public PostController(PostsRepository postsRepository) {
        this.postsRepository = postsRepository;
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Post post) {
        try {
            postsRepository.save(post);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
