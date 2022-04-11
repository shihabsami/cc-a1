package com.cc.a1.controller;

import com.cc.a1.security.JwtUtility;
import com.cc.a1.service.LikesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.cc.a1.security.SecurityConstants.AUTHORIZATION_HEADER;
import static com.cc.a1.security.SecurityConstants.JWT_SCHEME;

@RestController
@RequestMapping("/api/likes")
public class LikesController {

    private final LikesService likesService;
    private final JwtUtility jwtUtility;

    @Autowired
    public LikesController(LikesService likesService, JwtUtility jwtUtility) {
        this.likesService = likesService;
        this.jwtUtility = jwtUtility;
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestHeader(name = AUTHORIZATION_HEADER) String jwt, @RequestParam long postId) {
        String username = jwtUtility.extractUsername(jwt.substring(JWT_SCHEME.length() + 1));
        return new ResponseEntity<>(likesService.addLike(postId, username), HttpStatus.CREATED);
    }

    @PostMapping("/remove")
    public ResponseEntity<?> remove(@RequestHeader(name = AUTHORIZATION_HEADER) String jwt, @RequestParam long postId) {
        String username = jwtUtility.extractUsername(jwt.substring(JWT_SCHEME.length() + 1));
        likesService.removeLike(postId, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
