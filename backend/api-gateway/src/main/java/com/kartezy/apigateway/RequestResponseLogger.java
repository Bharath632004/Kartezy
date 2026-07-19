package com.kartezy.apigateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Request/Response Logger for API Gateway.
 * Logs incoming requests and outgoing responses for audit and debugging purposes.
 */
@Component
public class RequestResponseLogger extends AbstractGatewayFilterFactory<RequestResponseLogger.Config> {

    private static final Logger logger = LoggerFactory.getLogger(RequestResponseLogger.class);

    public RequestResponseLogger() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // Log request
            if (config.isLogRequest()) {
                logRequest(request, config);
            }

            // Process the request and capture the response
            return chain.filter(exchange)
                .doOnSuccess(v -> {
                    if (config.isLogResponse()) {
                        logResponse(exchange.getResponse(), null, config);
                    }
                })
                .doOnError(error -> {
                    if (config.isLogResponse()) {
                        logResponse(exchange.getResponse(), error, config);
                    }
                });
        };
    }

    private void logRequest(ServerHttpRequest request, Config config) {
        StringBuilder sb = new StringBuilder();
        sb.append("Incoming Request: ")
          .append("[")
          .append(request.getMethod())
          .append("] ")
          .append(request.getURI());

        if (config.isLogHeaders()) {
            sb.append(" Headers: [");
            request.getHeaders().entrySet().forEach(entry -> {
                if (!isSensitiveHeader(entry.getKey())) {
                    sb.append(entry.getKey()).append("=").append(entry.getValue()).append(", ");
                }
            });
            sb.append("]");
        }

        if (config.isLogQueryParams() && !request.getQueryParams().isEmpty()) {
            sb.append(" QueryParams: [");
            request.getQueryParams().entrySet().forEach(entry -> {
                sb.append(entry.getKey()).append("=").append(entry.getValue()).append(", ");
            });
            sb.append("]");
        }

        logger.info(sb.toString());
    }

    private void logResponse(ServerHttpResponse response, Throwable error, Config config) {
        StringBuilder sb = new StringBuilder();
        sb.append("Outgoing Response: ")
          .append("[")
          .append(response.getStatusCode())
          .append("]");

        if (error != null) {
            sb.append(" Error: ").append(error.getMessage());
        }

        if (config.isLogHeaders()) {
            sb.append(" Headers: [");
            response.getHeaders().entrySet().forEach(entry -> {
                if (!isSensitiveHeader(entry.getKey())) {
                    sb.append(entry.getKey()).append("=").append(entry.getValue()).append(", ");
                }
            });
            sb.append("]");
        }

        logger.info(sb.toString());
    }

    private boolean isSensitiveHeader(String headerName) {
        String lowerName = headerName.toLowerCase();
        return switch (lowerName) {
            case "authorization", "cookie", "x-api-key", "x-auth-token",
                 "proxy-authorization" -> true;
            default -> false;
        };
    }

    public static class Config {
        private boolean logRequest = true;
        private boolean logResponse = true;
        private boolean logHeaders = true;
        private boolean logQueryParams = true;

        public boolean isLogRequest() { return logRequest; }
        public void setLogRequest(boolean logRequest) { this.logRequest = logRequest; }
        public boolean isLogResponse() { return logResponse; }
        public void setLogResponse(boolean logResponse) { this.logResponse = logResponse; }
        public boolean isLogHeaders() { return logHeaders; }
        public void setLogHeaders(boolean logHeaders) { this.logHeaders = logHeaders; }
        public boolean isLogQueryParams() { return logQueryParams; }
        public void setLogQueryParams(boolean logQueryParams) { this.logQueryParams = logQueryParams; }
    }
}