package com.cc.a1.controller;

import com.cc.a1.model.Post;
import com.cc.a1.security.JwtUtility;
import com.cc.a1.service.PostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.cc.a1.security.SecurityConstants.AUTHORIZATION_HEADER;
import static com.cc.a1.security.SecurityConstants.JWT_SCHEME;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostsService postsService;
    private final JwtUtility jwtUtility;

    @Autowired
    public PostController(PostsService postsService, JwtUtility jwtUtility) {
        this.postsService = postsService;
        this.jwtUtility = jwtUtility;
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestHeader(name = AUTHORIZATION_HEADER) String jwt, @RequestBody Post post) {
        String username = jwtUtility.extractUsername(jwt.substring(JWT_SCHEME.length() + 1));
        return new ResponseEntity<>(postsService.savePost(post, username), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable long id) {
        return new ResponseEntity<>(postsService.getPostById(id), HttpStatus.CREATED);
    }

}
