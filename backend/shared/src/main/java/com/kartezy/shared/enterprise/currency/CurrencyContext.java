package com.kartezy.shared.enterprise.currency;

import java.util.Currency;

/**
 * Thread-local currency context for multi-currency support.
 * Tracks the current user's preferred currency across service boundaries.
 */
public final class CurrencyContext {

    private static final ThreadLocal<Currency> CURRENT_CURRENCY = new InheritableThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_CURRENCY_CODE = new InheritableThreadLocal<>();

    private CurrencyContext() {}

    public static void setCurrentCurrency(Currency currency) {
        CURRENT_CURRENCY.set(currency);
        CURRENT_CURRENCY_CODE.set(currency != null ? currency.getCurrencyCode() : "INR");
    }

    public static void setCurrentCurrencyCode(String currencyCode) {
        CURRENT_CURRENCY_CODE.set(currencyCode);
        try {
            CURRENT_CURRENCY.set(Currency.getInstance(currencyCode));
        } catch (IllegalArgumentException e) {
            CURRENT_CURRENCY.set(Currency.getInstance("INR"));
        }
    }

    public static Currency getCurrentCurrency() {
        Currency currency = CURRENT_CURRENCY.get();
        return currency != null ? currency : Currency.getInstance("INR");
    }

    public static String getCurrentCurrencyCode() {
        String code = CURRENT_CURRENCY_CODE.get();
        return code != null ? code : "INR";
    }

    public static void clear() {
        CURRENT_CURRENCY.remove();
        CURRENT_CURRENCY_CODE.remove();
    }
}
