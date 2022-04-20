package com.cc.a1.controller;

import com.cc.a1.security.JwtUtility;
import com.cc.a1.service.CommentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.cc.a1.security.SecurityConstants.AUTHORIZATION_HEADER;
import static com.cc.a1.security.SecurityConstants.JWT_SCHEME;

@RestController
@RequestMapping("/api/comments")
public class CommentsController {

    private final CommentsService commentsService;
    private final JwtUtility jwtUtility;

    @Autowired
    public CommentsController(CommentsService commentsService, JwtUtility jwtUtility) {
        this.commentsService = commentsService;
        this.jwtUtility = jwtUtility;
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestHeader(name = AUTHORIZATION_HEADER) String jwt,
                                 @RequestParam String text, @RequestParam long postId) {
        String username = jwtUtility.extractUsername(jwt.substring(JWT_SCHEME.length() + 1));
        return new ResponseEntity<>(commentsService.save(text, postId, username), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> getByPostId(@RequestParam long postId) {
        return new ResponseEntity<>(commentsService.getByPostId(postId), HttpStatus.OK);
    }

}
