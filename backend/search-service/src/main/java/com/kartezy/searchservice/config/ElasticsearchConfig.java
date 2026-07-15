package com.kartezy.searchservice.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories(basePackages = "com.kartezy.searchservice.repository")
public class ElasticsearchConfig {

    /**
     * Override the ElasticsearchClient bean with @Primary to resolve any conflicts.
     * Relies on Spring Boot's auto-configured RestClient from spring.elasticsearch.uris.
     */
    @Bean
    @Primary
    public ElasticsearchClient elasticsearchClient(ElasticsearchTemplate template) {
        return template.getElasticsearchClient();
    }
}
