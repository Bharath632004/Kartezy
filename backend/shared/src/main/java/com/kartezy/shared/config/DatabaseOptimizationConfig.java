package com.kartezy.shared.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.concurrent.TimeUnit;

/**
 * Database optimization configuration.
 * <p>
 * Features:
 * - HikariCP connection pool tuning
 * - Read replica support (read/write splitting)
 * - Slow query logging
 * - Connection leak detection
 * - Statement caching for repeated queries
 * </p>
 */
@Configuration
public class DatabaseOptimizationConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseOptimizationConfig.class);

    @Value("${spring.datasource.url}")
    private String primaryUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.hikari.maximum-pool-size:20}")
    private int maxPoolSize;

    @Value("${spring.datasource.hikari.minimum-idle:5}")
    private int minIdle;

    @Value("${spring.datasource.hikari.idle-timeout:300000}")
    private long idleTimeout;

    @Value("${spring.datasource.hikari.max-lifetime:1200000}")
    private long maxLifetime;

    @Value("${spring.datasource.hikari.connection-timeout:5000}")
    private long connectionTimeout;

    @Value("${spring.datasource.hikari.connection-test-query:SELECT 1}")
    private String connectionTestQuery;

    @Value("${spring.datasource.hikari.leak-detection-threshold:60000}")
    private long leakDetectionThreshold;

    /**
     * Primary (write) data source with optimized HikariCP configuration.
     */
    @Bean
    @Primary
    public DataSource primaryDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(primaryUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setMaximumPoolSize(maxPoolSize);
        config.setMinimumIdle(minIdle);
        config.setIdleTimeout(idleTimeout);
        config.setMaxLifetime(maxLifetime);
        config.setConnectionTimeout(connectionTimeout);
        config.setConnectionTestQuery(connectionTestQuery);
        config.setLeakDetectionThreshold(leakDetectionThreshold);
        config.setPoolName("Kartezy-Primary");

        // PgBouncer compatibility
        config.addDataSourceProperty("prepareThreshold", "0");

        // Statement caching (PostgreSQL specific)
        config.addDataSourceProperty("preparedStatementCacheQueries", "256");
        config.addDataSourceProperty("preparedStatementCacheSizeMiB", "5");

        // TCP optimizations
        config.addDataSourceProperty("tcpKeepAlive", "true");
        config.addDataSourceProperty("ApplicationName", "Kartezy");

        // Socket timeout (30s) - must be greater than max query execution time
        config.addDataSourceProperty("socketTimeout", "30");

        HikariDataSource dataSource = new HikariDataSource(config);
        log.info("Primary database pool configured: max={}, min={}, url={}",
                maxPoolSize, minIdle, maskUrl(primaryUrl));
        return dataSource;
    }

    /**
     * Read replica data source (enabled when READ_REPLICA_URL is set).
     * In production, configure SPRING_DATASOURCE_READ_REPLICA_URL for read/write splitting.
     */
    @Bean
    @ConditionalOnProperty(name = "spring.datasource.read-replica.url")
    public DataSource readReplicaDataSource(
            @Value("${spring.datasource.read-replica.url}") String replicaUrl,
            @Value("${spring.datasource.read-replica.maximum-pool-size:30}") int replicaMaxPool) {

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(replicaUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setMaximumPoolSize(replicaMaxPool);
        config.setMinimumIdle(Math.max(minIdle, 10));
        config.setIdleTimeout(idleTimeout);
        config.setMaxLifetime(maxLifetime);
        config.setConnectionTimeout(connectionTimeout);
        config.setConnectionTestQuery(connectionTestQuery);
        config.setLeakDetectionThreshold(leakDetectionThreshold);
        config.setPoolName("Kartezy-Replica");
        config.addDataSourceProperty("ApplicationName", "Kartezy-ReadReplica");
        config.setReadOnly(true);

        HikariDataSource dataSource = new HikariDataSource(config);
        log.info("Read replica pool configured: max={}, url={}",
                replicaMaxPool, maskUrl(replicaUrl));
        return dataSource;
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource primaryDataSource) {
        return new JdbcTemplate(primaryDataSource);
    }

    /**
     * Masks credentials in JDBC URLs for safe logging.
     */
    private String maskUrl(String url) {
        if (url == null) return "null";
        return url.replaceAll("//[^@]+@", "//****:****@");
    }
}
