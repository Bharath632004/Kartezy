package com.kartezy.shared.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:unknown-service}")
    private String serviceName;

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        Components components = new Components()
                .addSecuritySchemes(securitySchemeName,
                        new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT Bearer token"));

        List<Server> servers = List.of(
                new Server().url("http://localhost:" + serverPort).description("Local development"),
                new Server().url("https://api.kartezy.com").description("Production"));

        Info info = new Info()
                .title(serviceName)
                .description("Kartezy " + serviceName + " API documentation")
                .version("1.0.0")
                .contact(new Contact()
                        .name("Kartezy Team")
                        .email("support@kartezy.com"))
                .license(new License()
                        .name("Proprietary")
                        .url("https://kartezy.com"));

        return new OpenAPI()
                .info(info)
                .servers(servers)
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(components);
    }
}
