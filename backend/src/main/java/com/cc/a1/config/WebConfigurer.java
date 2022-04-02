package com.cc.a1.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configures Spring Web to allow certain CORS mappings.
 */
@Configuration
public class WebConfigurer {

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                WebMvcConfigurer.super.addCorsMappings(registry);
                registry.addMapping("/**")
                        // TODO Allows only the default React port for the frontend. May need to be updated in the future.
                        .allowedOrigins("http://localhost:3000").allowedMethods("GET", "POST", "PUT", "DELETE");
            }

        };
    }
}
