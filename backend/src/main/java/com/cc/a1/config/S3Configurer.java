package com.cc.a1.config;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures Amazon S3 client to allow REST calls on the bucket.
 */
@Configuration
public class S3Configurer {

    @Value("${aws.s3.region}")
    public String region;

    @Bean
    public AmazonS3 amazonS3() {
        // Create Amazon S3 client.
        return AmazonS3ClientBuilder
                .standard()
                .withRegion(Regions.fromName(region))
                .build();
    }

}
