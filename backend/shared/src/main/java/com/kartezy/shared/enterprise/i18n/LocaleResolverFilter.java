package com.kartezy.shared.enterprise.i18n;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

/**
 * Servlet filter that resolves and sets the user's locale based on:
 * - Accept-Language header
 * - X-Language header
 * - Cookie
 * - User profile preference
 * - Request parameter
 * - Default tenant locale
 */
@Slf4j
@Component
@Order(2)
public class LocaleResolverFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        try {
            Locale resolvedLocale = resolveLocale(request);

            LocaleContext.setCurrentLocale(resolvedLocale);

            // Add language info to response headers
            response.setHeader("Content-Language", resolvedLocale.toLanguageTag());
            response.setHeader("X-Language", resolvedLocale.getLanguage());

            if (LocaleContext.isRtlMode()) {
                response.setHeader("X-Text-Direction", "rtl");
            }

            log.debug("Locale resolved: {} (RTL: {})", resolvedLocale, LocaleContext.isRtlMode());

            filterChain.doFilter(request, response);

        } finally {
            LocaleContext.clear();
        }
    }

    private Locale resolveLocale(HttpServletRequest request) {
        // 1. Check X-Language header (highest priority)
        String langHeader = request.getHeader("X-Language");
        if (langHeader != null && !langHeader.isBlank()) {
            return Locale.forLanguageTag(langHeader);
        }

        // 2. Check X-Locale header
        String localeHeader = request.getHeader("X-Locale");
        if (localeHeader != null && !localeHeader.isBlank()) {
            return Locale.forLanguageTag(localeHeader);
        }

        // 3. Check Accept-Language header
        String acceptLang = request.getHeader("Accept-Language");
        if (acceptLang != null && !acceptLang.isBlank()) {
            try {
                List<Locale.LanguageRange> ranges = Locale.LanguageRange.parse(acceptLang);
                if (!ranges.isEmpty()) {
                    Locale resolved = Locale.lookup(ranges, List.of(
                            Locale.ENGLISH, Locale.forLanguageTag("hi"),
                            Locale.forLanguageTag("bn"), Locale.forLanguageTag("te"),
                            Locale.forLanguageTag("mr"), Locale.forLanguageTag("ta"),
                            Locale.forLanguageTag("gu"), Locale.FRENCH,
                            Locale.GERMAN, Locale.JAPANESE, Locale.CHINESE,
                            Locale.forLanguageTag("ar"), Locale.forLanguageTag("es"),
                            Locale.forLanguageTag("pt"), Locale.forLanguageTag("ru"),
                            Locale.forLanguageTag("ko"), Locale.forLanguageTag("it"),
                            Locale.forLanguageTag("nl")
                    ));
                    if (resolved != null) {
                        return resolved;
                    }
                }
            } catch (IllegalArgumentException e) {
                log.debug("Invalid Accept-Language header: {}", acceptLang);
            }
        }

        // 4. Check request parameter
        String langParam = request.getParameter("lang");
        if (langParam != null && !langParam.isBlank()) {
            return Locale.forLanguageTag(langParam);
        }

        // 5. Default to English
        return Locale.ENGLISH;
    }
}
