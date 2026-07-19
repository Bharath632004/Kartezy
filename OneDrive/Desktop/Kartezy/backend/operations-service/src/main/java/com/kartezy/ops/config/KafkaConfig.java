package com.kartezy.ops.config;

import com.kartezy.ops.constants.OpsConstants;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
@EnableKafka
@Profile("!test")
public class KafkaConfig {

    @Bean
    public NewTopic opsEventsTopic() {
        return TopicBuilder.name(OpsConstants.TOPIC_OPS_EVENTS).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic slaEventsTopic() {
        return TopicBuilder.name(OpsConstants.TOPIC_SLA_EVENTS).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic incidentEventsTopic() {
        return TopicBuilder.name(OpsConstants.TOPIC_INCIDENT_EVENTS).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic escalationEventsTopic() {
        return TopicBuilder.name(OpsConstants.TOPIC_ESCALATION_EVENTS).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic inventoryEventsTopic() {
        return TopicBuilder.name(OpsConstants.TOPIC_INVENTORY_EVENTS).partitions(3).replicas(1).build();
    }
}
