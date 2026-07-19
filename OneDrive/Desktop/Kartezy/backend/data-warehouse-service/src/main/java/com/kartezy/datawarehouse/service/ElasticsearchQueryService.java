package com.kartezy.datawarehouse.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.*;
import java.util.*;

@Service
public class ElasticsearchQueryService {
    private final String esUrl;
    private final HttpClient client;

    public ElasticsearchQueryService(@Value("${elasticsearch.host:localhost}") String host,
                                      @Value("${elasticsearch.port:9200}") int port) {
        this.esUrl = "http://" + host + ":" + port;
        this.client = HttpClient.newHttpClient();
    }

    public Map<String, Object> search(String index, String query) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(esUrl + "/" + index + "/_search"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(query))
                .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                // Parse and return simplified results
                Map<String, Object> result = new HashMap<>();
                result.put("status", "success");
                result.put("raw", response.body().substring(0, Math.min(response.body().length(), 1000)));
                return result;
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());
            return error;
        }
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("status", "unavailable");
        fallback.put("message", "Elasticsearch not reachable");
        return fallback;
    }

    public Map<String, Object> healthCheck() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(esUrl + "/_cluster/health"))
                .GET().build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> result = new HashMap<>();
            if (response.statusCode() == 200) {
                result.put("status", "connected");
                result.put("clusterInfo", response.body().substring(0, Math.min(response.body().length(), 500)));
            } else {
                result.put("status", "error");
                result.put("code", response.statusCode());
            }
            return result;
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("status", "disconnected");
            result.put("message", e.getMessage());
            return result;
        }
    }
}
