package com.kartezy.crm.config;

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
                .title("Kartezy Enterprise CRM API")
                .description("""
                    Comprehensive CRM Platform API
                    
                    Modules:
                    - Customer CRM & Merchant CRM
                    - Lead Management & Scoring
                    - Referral & Loyalty Engine
                    - Email / SMS / WhatsApp / Push Campaigns
                    - Marketing Automation
                    - Customer Segmentation
                    - Behavior Tracking & A/B Testing
                    - Coupons & Rewards
                    - Campaign Analytics & Dashboard
                    - AI Platform Integration""")
                .version("1.0.0")
                .contact(new Contact().name("Kartezy CRM Team").email("crm@kartezy.com"))
                .license(new License().name("Proprietary")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer"))
            .components(new io.swagger.v3.oas.models.Components()
                .addSecuritySchemes("Bearer", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
