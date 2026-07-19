package com.kartezy.finance.config;

import io.swagger.v3.oas.models.Components;
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
                .title("Kartezy Finance & ERP API")
                .description("Comprehensive Finance and ERP Platform API\n\n" +
                    "Modules:\n" +
                    "- Merchant Settlements\n- Vendor Management\n- Supplier Management\n" +
                    "- Purchase Orders\n- Invoices & GST\n- Tax Management\n- Accounting & Ledger\n" +
                    "- Revenue & P&L\n- Cash Flow\n- Wallet Accounting\n- Refund Accounting\n" +
                    "- Commission Engine\n- Multi-bank Support\n- Payment Reconciliation\n- Audit Trail")
                .version("1.0.0")
                .contact(new Contact()
                    .name("Kartezy Finance Team")
                    .email("finance@kartezy.com"))
                .license(new License().name("Proprietary")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer"))
            .components(new Components()
                .addSecuritySchemes("Bearer",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
