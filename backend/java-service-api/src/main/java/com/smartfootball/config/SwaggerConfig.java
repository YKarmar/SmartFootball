package com.smartfootball.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import org.springframework.context.annotation.*;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("SmartFootball API Documentation")
                .version("1.0.0")
                .description("API documentation for SmartFootball backend service."));
    }
}
