package com.kartezy.integration;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Abstract base class for all integration tests.
 * Provides Testcontainers for PostgreSQL and Kafka,
 * common HTTP methods, and JWT token generation utilities.
 */
@Testcontainers
@ActiveProfiles("test")
public abstract class IntegrationTestBase {

    // ================================================================
    // Testcontainers
    // ================================================================

    @Container
    protected static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            DockerImageName.parse("postgres:15-alpine")
    )
            .withDatabaseName("kartezy_test")
            .withUsername("test")
            .withPassword("test");

    @Container
    protected static KafkaContainer kafka = new KafkaContainer(
            DockerImageName.parse("confluentinc/cp-kafka:7.6.1")
    );

    // ================================================================
    // Dynamic Properties
    // ================================================================

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // PostgreSQL
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.datasource.driver-class-name", () -> "org.postgresql.Driver");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.jpa.show-sql", () -> "true");
        registry.add("spring.jpa.properties.hibernate.dialect",
                () -> "org.hibernate.dialect.PostgreSQLDialect");

        // Kafka
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
        registry.add("spring.kafka.consumer.auto-offset-reset", () -> "earliest");

        // Disable Eureka for tests
        registry.add("eureka.client.enabled", () -> "false");
        registry.add("eureka.client.register-with-eureka", () -> "false");
        registry.add("eureka.client.fetch-registry", () -> "false");

        // Disable discovery for tests
        registry.add("spring.cloud.discovery.enabled", () -> "false");
        registry.add("spring.cloud.config.enabled", () -> "false");

        // JWT for testing
        registry.add("jwt.secret", () ->
                "dGhpcyBpcyBhIHRlc3Qgc2VjcmV0IGtleSBmb3IgaW50ZWdyYXRpb24gdGVzdHM=");
        registry.add("jwt.expiration", () -> "86400000");
        registry.add("jwt.refresh-token.expiration", () -> "604800000");

        // Configure OAuth2 resource server for JWT validation
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri", () -> "http://localhost:8081");
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri", () -> "http://localhost:8081/oauth2/jwks");

        // Redis - skip for integration tests (use in-memory instead)
        registry.add("spring.redis.enabled", () -> "false");
        registry.add("spring.cache.type", () -> "none");

        // Server
        registry.add("server.port", () -> "0");
    }

    // ================================================================
    // JWT Token Helpers
    // ================================================================

    private static final String TEST_SECRET =
            "dGhpcyBpcyBhIHRlc3Qgc2VjcmV0IGtleSBmb3IgaW50ZWdyYXRpb24gdGVzdHM=";

    /**
     * Generate a JWT access token for testing.
     */
    protected String generateTestToken(String username, String... roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("user_id", username);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Generate a JWT refresh token for testing.
     */
    protected String generateTestRefreshToken() {
        return Jwts.builder()
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 604800000))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(TEST_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ================================================================
    // HTTP Request Helpers
    // ================================================================

    /**
     * Create HTTP headers with JSON content type.
     */
    protected HttpHeaders jsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    /**
     * Create HTTP headers with JSON content type and Bearer token.
     */
    protected HttpHeaders authHeaders(String token) {
        HttpHeaders headers = jsonHeaders();
        headers.setBearerAuth(token);
        return headers;
    }

    /**
     * Create an HttpEntity with JSON body and headers.
     */
    protected <T> HttpEntity<T> jsonEntity(T body) {
        return new HttpEntity<>(body, jsonHeaders());
    }

    /**
     * Create an HttpEntity with JSON body and auth headers.
     */
    protected <T> HttpEntity<T> authEntity(T body, String token) {
        return new HttpEntity<>(body, authHeaders(token));
    }

    /**
     * Create an empty HttpEntity with auth headers.
     */
    protected HttpEntity<Void> authEntity(String token) {
        return new HttpEntity<>(authHeaders(token));
    }
}
