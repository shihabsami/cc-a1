package com.cc.a1.controller;

import com.cc.a1.service.ImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
public class ImagesController {

    private final ImagesService imagesService;

    @Autowired
    public ImagesController(ImagesService imagesService) {
        this.imagesService = imagesService;
    }

    @PostMapping("/savePostImage")
    public ResponseEntity<?> savePostImage(@RequestParam MultipartFile image, @RequestParam long postId) {
        return new ResponseEntity<>(imagesService.savePostImage(image, postId), HttpStatus.CREATED);
    }

    @PostMapping("/saveProfileImage")
    public ResponseEntity<?> save(@RequestParam MultipartFile image, @RequestParam String username) {
        return new ResponseEntity<>(imagesService.saveProfileImage(image, username), HttpStatus.CREATED);
    }

}
