package com.kartezy.searchservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories(basePackages = "com.kartezy.searchservice.repository")
public class ElasticsearchConfig {
    // ElasticsearchClient is auto-configured by Spring Boot
}
