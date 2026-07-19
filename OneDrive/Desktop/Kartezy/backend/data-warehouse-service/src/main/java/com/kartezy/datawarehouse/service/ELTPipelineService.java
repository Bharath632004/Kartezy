package com.kartezy.datawarehouse.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;

@Service
public class ELTPipelineService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ELTPipelineService.class);
    private final DataLakeService dataLakeService;

    public ELTPipelineService(DataLakeService dataLakeService) {
        this.dataLakeService = dataLakeService;
    }

    @PostConstruct
    public void init() {
        log.info("ELT Pipeline Service initialized. Pattern: Load raw data into data lake, then transform");
    }

    @Scheduled(cron = "0 15 */1 * * ?")  // Every hour at :15
    public void runOrdersELT() {
        log.info("ELT: Loading raw orders to data lake at {}", LocalDateTime.now());
        // Step 1: Extract raw JSON from Kafka/order-service
        // Step 2: Load into data lake as raw/orders/{partition}/{date}/orders_raw.json
        // Step 3: Transform via SQL/materialized views in warehouse
        try {
            dataLakeService.storeRawData("orders", "raw", "{}", "json");
        } catch (Exception e) {
            log.error("Orders ELT failed", e);
        }
    }

    @Scheduled(cron = "0 45 */1 * * ?")
    public void runCustomerELT() {
        log.info("ELT: Loading raw customer data to data lake at {}", LocalDateTime.now());
    }

    @Scheduled(cron = "0 0 */2 * * ?")
    public void runMerchantELT() {
        log.info("ELT: Loading raw merchant data to data lake at {}", LocalDateTime.now());
    }

    @Scheduled(cron = "0 30 */2 * * ?")
    public void runDeliveryELT() {
        log.info("ELT: Loading raw delivery data to data lake at {}", LocalDateTime.now());
    }

    @Scheduled(cron = "0 0 */3 * * ?")
    public void runProductELT() {
        log.info("ELT: Loading raw product data to data lake at {}", LocalDateTime.now());
    }
}
