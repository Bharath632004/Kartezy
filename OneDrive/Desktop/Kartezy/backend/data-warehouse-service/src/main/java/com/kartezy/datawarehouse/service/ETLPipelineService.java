package com.kartezy.datawarehouse.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;

@Service
public class ETLPipelineService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ETLPipelineService.class);

    @PostConstruct
    public void init() {
        log.info("Data Warehouse ETL Pipeline Service initialized");
    }

    @Scheduled(cron = "${warehouse.etl.cron.orders}")
    public void runOrdersETL() {
        log.info("Running orders ETL pipeline at {}", LocalDateTime.now());
        // Reads from order-service via Feign client, transforms, loads into dw_daily_orders_fact
    }

    @Scheduled(cron = "${warehouse.etl.cron.inventory}")
    public void runInventoryETL() {
        log.info("Running inventory ETL pipeline at {}", LocalDateTime.now());
        // Reads from inventory-service, transforms, loads into fact tables
    }

    @Scheduled(cron = "${warehouse.etl.cron.users}")
    public void runUsersETL() {
        log.info("Running users ETL pipeline at {}", LocalDateTime.now());
        // Reads from user-service, transforms, loads into dw_daily_customer_fact
    }

    @Scheduled(cron = "${warehouse.etl.cron.payments}")
    public void runPaymentsETL() {
        log.info("Running payments ETL pipeline at {}", LocalDateTime.now());
        // Reads from payment-service, transforms, loads into finance fact tables
    }

    @Scheduled(cron = "${warehouse.etl.cron.merchants}")
    public void runMerchantsETL() {
        log.info("Running merchants ETL pipeline at {}", LocalDateTime.now());
        // Reads from merchant-service, transforms, loads into dw_daily_merchant_fact
    }

    @Scheduled(cron = "${warehouse.etl.cron.delivery}")
    public void runDeliveryETL() {
        log.info("Running delivery ETL pipeline at {}", LocalDateTime.now());
        // Reads from delivery-service, transforms, loads into dw_daily_delivery_fact
    }

    @Scheduled(cron = "${warehouse.etl.cron.products}")
    public void runProductsETL() {
        log.info("Running products ETL pipeline at {}", LocalDateTime.now());
        // Reads from product-service, transforms, loads into dw_daily_product_fact
    }

    public void runFullETL() {
        log.info("Running full ETL refresh at {}", LocalDateTime.now());
        runOrdersETL(); runInventoryETL(); runUsersETL(); runPaymentsETL();
        runMerchantsETL(); runDeliveryETL(); runProductsETL();
    }
}
