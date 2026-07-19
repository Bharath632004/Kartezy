package com.kartezy.datawarehouse.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {
    public static final String TOPIC_ORDERS = "warehouse.orders";
    public static final String TOPIC_PAYMENTS = "warehouse.payments";
    public static final String TOPIC_USERS = "warehouse.users";
    public static final String TOPIC_INVENTORY = "warehouse.inventory";
    public static final String TOPIC_ANALYTICS_EVENTS = "analytics.events";

    @Bean
    public NewTopic ordersTopic() { return TopicBuilder.name(TOPIC_ORDERS).partitions(3).replicas(1).build(); }
    @Bean
    public NewTopic paymentsTopic() { return TopicBuilder.name(TOPIC_PAYMENTS).partitions(3).replicas(1).build(); }
    @Bean
    public NewTopic usersTopic() { return TopicBuilder.name(TOPIC_USERS).partitions(3).replicas(1).build(); }
    @Bean
    public NewTopic inventoryTopic() { return TopicBuilder.name(TOPIC_INVENTORY).partitions(3).replicas(1).build(); }
    @Bean
    public NewTopic analyticsEventsTopic() { return TopicBuilder.name(TOPIC_ANALYTICS_EVENTS).partitions(5).replicas(1).build(); }
}
