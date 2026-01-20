package com.ecommerce.backend.WebConfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Registry-based config
@Configuration
public class WebConfig {
    
    @Value("${ALLOWED_ORIGINS}")
    private String allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Apply to all paths
                        // .allowedOrigins("http://localhost:3000",
                        // "https://relaxed-mermaid-700c70.netlify.app") // Allowed origins
                        .allowedOrigins(allowedOrigins.split(","))
                        .allowedMethods("*") // Allowed HTTP methods
                        .allowedHeaders("*") // Allowed headers
                        .allowCredentials(true); // Allow credentials like cookies
                // .maxAge(3600); // Cache preflight response for 1 hour
            }
        };
    }
}