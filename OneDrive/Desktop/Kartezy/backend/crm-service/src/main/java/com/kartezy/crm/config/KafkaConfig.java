package com.kartezy.crm.config;

import com.kartezy.crm.constants.CrmConstants;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
@EnableKafka
@Profile("!test")
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String bootstrapServers;

    @Bean
    public NewTopic crmEventsTopic() {
        return TopicBuilder.name(CrmConstants.TOPIC_CRM_EVENTS).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic campaignEventsTopic() {
        return TopicBuilder.name(CrmConstants.TOPIC_CAMPAIGN_EVENTS).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic notificationEventsTopic() {
        return TopicBuilder.name(CrmConstants.TOPIC_NOTIFICATION_EVENTS).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic loyaltyEventsTopic() {
        return TopicBuilder.name(CrmConstants.TOPIC_LOYALTY_EVENTS).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic aiEventsTopic() {
        return TopicBuilder.name(CrmConstants.TOPIC_AI_EVENTS).partitions(3).replicas(1).build();
    }
}
