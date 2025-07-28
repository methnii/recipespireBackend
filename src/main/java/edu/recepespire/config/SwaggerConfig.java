package edu.recepespire.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI recipeSphereOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("RecipeSphere API")
                        .description("API for Recipe Management System")
                        .version("v1.0"));
    }
}