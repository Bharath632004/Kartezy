package com.kartezy.ops.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Kartezy Operations Platform API")
                .description("""
                    Comprehensive Operations Platform API
                    
                    Modules:
                    - City Operations & Zone Management
                    - Warehouse Operations
                    - Merchant Operations & Verification
                    - Inventory Operations & Health Monitoring
                    - Delivery Operations & Fleet Management
                    - Customer Operations & KYC
                    - Support Operations & Ticket Management
                    - Escalation Management (L1/L2/L3)
                    - SLA Monitoring & Breach Detection
                    - Incident Tracking & Response
                    - Business Rules Engine
                    - Real-time Operations Dashboard""")
                .version("1.0.0")
                .contact(new Contact().name("Kartezy Ops Team").email("ops@kartezy.com"))
                .license(new License().name("Proprietary")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer"))
            .components(new io.swagger.v3.oas.models.Components()
                .addSecuritySchemes("Bearer", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
