package com.cc.a1.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import com.cc.a1.exception.InvalidImageException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class S3Service {

    private final AmazonS3 s3Client;
    @Value("${aws.s3.bucket-name}")
    public String bucketName;

    @Autowired
    public S3Service(AmazonS3 s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile multipartFile) {
        // Validate file is not empty.
        if (multipartFile.isEmpty())
            throw new InvalidImageException("File is empty.");

        // Validate file name and extension.
        String originalFileName = multipartFile.getOriginalFilename();
        String fileExtension = StringUtils.getFilenameExtension(originalFileName);
        if (originalFileName == null || fileExtension == null || originalFileName.isEmpty() || fileExtension.isEmpty())
            throw new InvalidImageException("Could not acquire file name or extension.");

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());
        String newFileName = getCleanFileName(LocalDateTime.now() + "_" + originalFileName);

        TransferManager transferManager = TransferManagerBuilder.standard().withS3Client(s3Client).build();
        try {
            transferManager.upload(
                    new PutObjectRequest(bucketName, newFileName, multipartFile.getInputStream(), metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead)).waitForUploadResult();
        } catch (AmazonServiceException | IOException | InterruptedException exception) {

            throw new InvalidImageException("Could not upload image.");
        }

        return newFileName;
    }

    private String getCleanFileName(String fileName) {
        String replacement = "_";
        return fileName.replace(" ", replacement)
                       .replace("\\", replacement)
                       .replace("/", replacement)
                       .replace(":", replacement)
                       .replace("*", replacement)
                       .replace("?", replacement)
                       .replace("\"", replacement)
                       .replace("<", replacement)
                       .replace(">", replacement)
                       .replace("|", replacement);
    }

}
