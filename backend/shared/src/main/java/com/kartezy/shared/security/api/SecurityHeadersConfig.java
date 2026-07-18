package com.kartezy.shared.security.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.util.UrlPathHelper;

/**
 * Configuration for security headers to protect against various web vulnerabilities.
 */
@Configuration
public class SecurityHeadersConfig implements WebMvcConfigurer {

    /**
     * Configures CORS mappings with security-conscious defaults.
     * Adjust these values based on your application's requirements.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://yourdomain.com") // Replace with your actual domain
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false) // Set to true only if needed
                .maxAge(3600);
    }

    /**
     * Creates a filter to add security headers to responses.
     * This would typically be implemented as a Filter or HandlerInterceptor.
     * For brevity, we're showing the concept here.
     */
    @Bean
    public SecurityHeadersFilter securityHeadersFilter() {
        return new SecurityHeadersFilter();
    }
}

/**
 * Filter that adds security headers to HTTP responses.
 */
class SecurityHeadersFilter implements jakarta.servlet.Filter {

    @Override
    public void doFilter(jakarta.servlet.ServletRequest request,
                         jakarta.servlet.ServletResponse response,
                         jakarta.servlet.FilterChain chain)
            throws java.io.IOException, jakarta.servlet.ServletException {

        jakarta.servlet.http.HttpServletResponse httpResponse =
                (jakarta.servlet.http.HttpServletResponse) response;

        // Security Headers
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        httpResponse.setHeader("X-Frame-Options", "DENY");
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        httpResponse.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

        // Content Security Policy - adjust based on your needs
        String csp = "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self'; " +
                "connect-src 'self'; " +
                "frame-ancestors 'none';";
        httpResponse.setHeader("Content-Security-Policy", csp);

        // HTTP Strict Transport Security (HSTS) - enable in production with proper SSL
        // httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

        chain.doFilter(request, response);
    }
}