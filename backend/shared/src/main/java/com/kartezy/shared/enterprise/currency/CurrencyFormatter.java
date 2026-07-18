package com.kartezy.shared.enterprise.currency;

import com.kartezy.shared.enterprise.i18n.LocaleContext;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Currency;
import java.util.Locale;

/**
 * Formats monetary amounts according to the user's locale and currency preferences.
 * Supports all major currencies with proper symbol placement, decimal separators,
 * and grouping characters.
 */
public final class CurrencyFormatter {

    private CurrencyFormatter() {}

    /**
     * Format an amount using the current thread's locale and currency context.
     */
    public static String format(BigDecimal amount) {
        return format(amount, CurrencyContext.getCurrentCurrency(), LocaleContext.getCurrentLocale());
    }

    /**
     * Format an amount with a specific currency and locale.
     */
    public static String format(BigDecimal amount, Currency currency, Locale locale) {
        if (amount == null) return "--";

        NumberFormat format = NumberFormat.getCurrencyInstance(locale);
        format.setCurrency(currency);
        format.setMinimumFractionDigits(currency.getDefaultFractionDigits());
        format.setMaximumFractionDigits(currency.getDefaultFractionDigits());

        return format.format(amount);
    }

    /**
     * Format an amount without currency symbol.
     */
    public static String formatPlain(BigDecimal amount) {
        return formatPlain(amount, CurrencyContext.getCurrentCurrency(), LocaleContext.getCurrentLocale());
    }

    public static String formatPlain(BigDecimal amount, Currency currency, Locale locale) {
        if (amount == null) return "--";

        NumberFormat format = NumberFormat.getNumberInstance(locale);
        format.setMinimumFractionDigits(currency.getDefaultFractionDigits());
        format.setMaximumFractionDigits(currency.getDefaultFractionDigits());

        return format.format(amount);
    }

    /**
     * Format with currency code (e.g., "INR 1,234.56").
     */
    public static String formatWithCode(BigDecimal amount) {
        return formatWithCode(amount, CurrencyContext.getCurrentCurrency(), LocaleContext.getCurrentLocale());
    }

    public static String formatWithCode(BigDecimal amount, Currency currency, Locale locale) {
        if (amount == null) return "--";
        return currency.getCurrencyCode() + " " + formatPlain(amount, currency, locale);
    }

    /**
     * Parse a formatted currency string back to BigDecimal.
     */
    public static BigDecimal parse(String formatted, Currency currency, Locale locale) {
        try {
            NumberFormat format = NumberFormat.getCurrencyInstance(locale);
            format.setCurrency(currency);
            Number number = format.parse(formatted);
            return BigDecimal.valueOf(number.doubleValue());
        } catch (Exception e) {
            throw new IllegalArgumentException("Cannot parse currency string: " + formatted, e);
        }
    }
}
