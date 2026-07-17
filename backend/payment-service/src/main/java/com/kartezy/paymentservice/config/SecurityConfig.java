package com.kartezy.paymentservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${jwt.secret:KartezyPlatformSecretKeyForJWTTokenSigning2024VerySecure}")
    private String jwtSecretBase64;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder())))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health", "/", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/**/health", "/**/").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Use environment variable or externalized config; never hardcode in production
        String secret = jwtSecretBase64;
        if (secret == null || secret.isEmpty()) {
            secret = Base64.getEncoder().encodeToString(
                "KartezyPlatformSecretKeyForJWTTokenSigning2024VerySecure".getBytes());
        }
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(secretKey).build();
    }
}
