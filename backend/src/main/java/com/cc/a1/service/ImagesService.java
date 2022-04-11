package com.cc.a1.service;

import com.cc.a1.exception.InvalidImageException;
import com.cc.a1.model.Image;
import com.cc.a1.model.Post;
import com.cc.a1.repository.ImagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImagesService {

    private final ImagesRepository imagesRepository;
    private final PostsService postsService;
    private final S3Service s3Service;

    @Autowired
    public ImagesService(ImagesRepository imagesRepository, PostsService postsService, S3Service s3Service) {
        this.imagesRepository = imagesRepository;
        this.postsService = postsService;
        this.s3Service = s3Service;
    }

    public Image saveImage(MultipartFile imageFile, long postId) {
        Post post = postsService.getPostById(postId);
        if (post.getImage() != null)
            throw new InvalidImageException(String.format("Post with id %d already has an image.", postId));

        String imageUrl = s3Service.uploadFile(imageFile);
        Image image = new Image();
        image.setUrl(imageUrl);
        image.setPost(post);

        return imagesRepository.save(image);
    }

}
