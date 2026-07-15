package com.kartezy.apigateway;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class ApiGatewayController {
    @GetMapping("/")
    public String home() {
        return "Welcome to api-gateway service";
    }
    @GetMapping("/health")
    public String health() {
        return "api-gateway is healthy";
    }
}
