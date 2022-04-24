package com.cc.a1.controller;

import com.cc.a1.service.ImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
public class ImagesController {

    private final ImagesService imagesService;

    @Autowired
    public ImagesController(ImagesService imagesService) {
        this.imagesService = imagesService;
    }

    @PostMapping("/save/user")
    public ResponseEntity<?> saveUserImage(@RequestParam MultipartFile image, @RequestParam String username) {
        return new ResponseEntity<>(imagesService.saveUserImage(image, username), HttpStatus.CREATED);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> saveUserImage(@PathVariable Long id) {
        return new ResponseEntity<>(imagesService.getUserImage(id), HttpStatus.OK);
    }

}
