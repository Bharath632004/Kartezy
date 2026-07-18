package com.kartezy.shared.enterprise.currency;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Currency;

/**
 * Servlet filter that resolves the user's preferred currency from:
 * - X-Currency header
 * - User profile preference
 * - Geo-location based default
 * - Tenant default currency
 * - Accept-Language region
 */
@Slf4j
@Component
@Order(3)
public class CurrencyResolverFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        try {
            Currency resolvedCurrency = resolveCurrency(request);
            CurrencyContext.setCurrentCurrency(resolvedCurrency);

            response.setHeader("X-Currency", resolvedCurrency.getCurrencyCode());

            filterChain.doFilter(request, response);

        } finally {
            CurrencyContext.clear();
        }
    }

    private Currency resolveCurrency(HttpServletRequest request) {
        // 1. Check X-Currency header (highest priority)
        String currencyHeader = request.getHeader("X-Currency");
        if (currencyHeader != null && !currencyHeader.isBlank()) {
            try {
                return Currency.getInstance(currencyHeader.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.debug("Invalid currency code in header: {}", currencyHeader);
            }
        }

        // 2. Check Accept-Currency header
        String acceptCurrency = request.getHeader("Accept-Currency");
        if (acceptCurrency != null && !acceptCurrency.isBlank()) {
            try {
                return Currency.getInstance(acceptCurrency.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.debug("Invalid currency code in Accept-Currency: {}", acceptCurrency);
            }
        }

        // 3. Resolve from country in Accept-Language
        String acceptLang = request.getHeader("Accept-Language");
        if (acceptLang != null && acceptLang.contains("-")) {
            String[] parts = acceptLang.split(",")[0].split("-");
            if (parts.length >= 2) {
                String countryCode = parts[1].toUpperCase();
                try {
                    return Currency.getInstance(new java.util.Locale("", countryCode));
                } catch (IllegalArgumentException e) {
                    // Fall through
                }
            }
        }

        // 4. Default to INR (India context)
        return Currency.getInstance("INR");
    }
}
