package com.kartezy.shared.enterprise.currency;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Enterprise exchange rate service for multi-currency support.
 * Provides real-time and cached currency conversion rates.
 * Supports automatic rate updates and manual overrides.
 */
@Slf4j
@Service
public class ExchangeRateService {

    private static final String BASE_CURRENCY = "INR";
    private final Map<String, ExchangeRate> rates = new ConcurrentHashMap<>();
    private final Map<String, ExchangeRate> rateHistory = new ConcurrentHashMap<>();
    private ZonedDateTime lastUpdateTime;

    @PostConstruct
    public void init() {
        initializeDefaultRates();
        log.info("ExchangeRateService initialized with {} currency pairs", rates.size());
    }

    /**
     * Convert an amount from one currency to another.
     */
    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equalsIgnoreCase(toCurrency)) {
            return amount;
        }

        BigDecimal rate = getConversionRate(fromCurrency, toCurrency);
        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Get the conversion rate between two currencies.
     */
    public BigDecimal getConversionRate(String fromCurrency, String toCurrency) {
        if (fromCurrency.equalsIgnoreCase(toCurrency)) {
            return BigDecimal.ONE;
        }

        // Try direct rate
        String directKey = fromCurrency + "_" + toCurrency;
        ExchangeRate directRate = rates.get(directKey);
        if (directRate != null) {
            return directRate.getRate();
        }

        // Convert via base currency
        String fromBaseKey = fromCurrency + "_" + BASE_CURRENCY;
        String toBaseKey = toCurrency + "_" + BASE_CURRENCY;

        ExchangeRate fromRate = rates.get(fromBaseKey);
        ExchangeRate toRate = rates.get(toBaseKey);

        if (fromRate != null && toRate != null) {
            // Cross-rate calculation
            BigDecimal crossRate = toRate.getRate().divide(fromRate.getRate(), 6, RoundingMode.HALF_UP);
            return crossRate;
        }

        log.warn("No exchange rate found for {} -> {} (defaulting to 1:1)", fromCurrency, toCurrency);
        return BigDecimal.ONE;
    }

    /**
     * Update an exchange rate (for scheduled updates or manual overrides).
     */
    public void updateRate(String fromCurrency, String toCurrency, BigDecimal rate, String source) {
        String key = fromCurrency + "_" + toCurrency;
        ExchangeRate exchangeRate = new ExchangeRate(fromCurrency, toCurrency, rate, source, ZonedDateTime.now());
        rates.put(key, exchangeRate);
        lastUpdateTime = ZonedDateTime.now();
        log.info("Updated exchange rate: {} {} = {} {}", 1, fromCurrency, rate, toCurrency);
    }

    /**
     * Get all available currency pairs.
     */
    public Set<String> getSupportedCurrencyPairs() {
        return rates.keySet();
    }

    /**
     * Get the last time rates were updated.
     */
    public Optional<ZonedDateTime> getLastUpdateTime() {
        return Optional.ofNullable(lastUpdateTime);
    }

    /**
     * Bulk update exchange rates (from provider API).
     */
    public void bulkUpdateRates(Map<String, BigDecimal> newRates, String source) {
        for (Map.Entry<String, BigDecimal> entry : newRates.entrySet()) {
            String[] parts = entry.getKey().split("_");
            if (parts.length == 2) {
                updateRate(parts[0], parts[1], entry.getValue(), source);
            }
        }
        log.info("Bulk updated {} exchange rates from source: {}", newRates.size(), source);
    }

    private void initializeDefaultRates() {
        // Base: INR
        addRate("INR", "USD", "0.012");
        addRate("INR", "EUR", "0.011");
        addRate("INR", "GBP", "0.0095");
        addRate("INR", "JPY", "1.80");
        addRate("INR", "CNY", "0.087");
        addRate("INR", "AUD", "0.018");
        addRate("INR", "CAD", "0.016");
        addRate("INR", "CHF", "0.011");
        addRate("INR", "SGD", "0.016");
        addRate("INR", "AED", "0.044");
        addRate("INR", "SAR", "0.045");
        addRate("INR", "MYR", "0.056");
        addRate("INR", "THB", "0.43");
        addRate("INR", "BND", "0.016");
        addRate("INR", "LKR", "3.70");
        addRate("INR", "NPR", "1.60");
        addRate("INR", "BDT", "1.32");
        addRate("INR", "PKR", "3.35");

        // Also add reverse rates
        addRate("USD", "INR", "83.33");
        addRate("EUR", "INR", "90.91");
        addRate("GBP", "INR", "105.26");

        lastUpdateTime = ZonedDateTime.now();
    }

    private void addRate(String from, String to, String rateStr) {
        String key = from + "_" + to;
        BigDecimal rate = new BigDecimal(rateStr);
        rates.put(key, new ExchangeRate(from, to, rate, "SYSTEM_INIT", ZonedDateTime.now()));
    }

    /**
     * Exchange rate record.
     */
    public record ExchangeRate(
            String fromCurrency,
            String toCurrency,
            BigDecimal rate,
            String source,
            ZonedDateTime timestamp
    ) {}
}
