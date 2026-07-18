package com.kartezy.shared.enterprise.i18n;

import java.util.Locale;

/**
 * Thread-local locale context for multi-language support.
 * Tracks the current user's locale across service boundaries.
 */
public final class LocaleContext {

    private static final ThreadLocal<Locale> CURRENT_LOCALE = new InheritableThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_LANGUAGE = new InheritableThreadLocal<>();
    private static final ThreadLocal<Boolean> RTL_MODE = new InheritableThreadLocal<>();

    private LocaleContext() {}

    public static void setCurrentLocale(Locale locale) {
        CURRENT_LOCALE.set(locale);
        CURRENT_LANGUAGE.set(locale != null ? locale.getLanguage() : "en");
        RTL_MODE.set(locale != null && isRtlLanguage(locale.getLanguage()));
    }

    public static void setCurrentLanguage(String languageCode) {
        CURRENT_LANGUAGE.set(languageCode);
        CURRENT_LOCALE.set(Locale.forLanguageTag(languageCode));
        RTL_MODE.set(isRtlLanguage(languageCode));
    }

    public static Locale getCurrentLocale() {
        Locale locale = CURRENT_LOCALE.get();
        return locale != null ? locale : Locale.ENGLISH;
    }

    public static String getCurrentLanguage() {
        String lang = CURRENT_LANGUAGE.get();
        return lang != null ? lang : "en";
    }

    public static boolean isRtlMode() {
        Boolean rtl = RTL_MODE.get();
        return rtl != null && rtl;
    }

    public static void clear() {
        CURRENT_LOCALE.remove();
        CURRENT_LANGUAGE.remove();
        RTL_MODE.remove();
    }

    /**
     * Check if a language requires right-to-left (RTL) text direction.
     */
    public static boolean isRtlLanguage(String languageCode) {
        return switch (languageCode) {
            case "ar", "he", "ur", "fa", "yi", "ku" -> true;
            default -> false;
        };
    }

    /**
     * Get the display name for a language in its native form.
     */
    public static String getNativeLanguageName(String languageCode) {
        return switch (languageCode) {
            case "en" -> "English";
            case "hi" -> "हिन्दी";
            case "bn" -> "বাংলা";
            case "te" -> "తెలుగు";
            case "mr" -> "मराठी";
            case "ta" -> "தமிழ்";
            case "gu" -> "ગુજરાતી";
            case "kn" -> "ಕನ್ನಡ";
            case "ml" -> "മലയാളം";
            case "pa" -> "ਪੰਜਾਬੀ";
            case "or" -> "ଓଡ଼ିଆ";
            case "as" -> "অসমীয়া";
            case "ar" -> "العربية";
            case "fr" -> "Français";
            case "es" -> "Español";
            case "de" -> "Deutsch";
            case "zh" -> "中文";
            case "ja" -> "日本語";
            case "ko" -> "한국어";
            default -> languageCode;
        };
    }
}
