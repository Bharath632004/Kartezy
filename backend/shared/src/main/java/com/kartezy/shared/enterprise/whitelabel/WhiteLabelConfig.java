package com.kartezy.shared.enterprise.whitelabel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * White Label configuration for a tenant.
 * Allows complete brand customization for each enterprise customer.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhiteLabelConfig {

    private String tenantId;

    // Branding
    private String companyName;
    private String tagline;
    private String logoUrl;
    private String faviconUrl;
    private String loginPageBackground;
    private String emailHeaderLogo;
    private String emailFooterLogo;

    // Colors
    private String primaryColor;
    private String secondaryColor;
    private String accentColor;
    private String backgroundColor;
    private String textColor;
    private String headerColor;
    private String footerColor;
    private String buttonColor;
    private String linkColor;
    private String errorColor;
    private String successColor;

    // Typography
    private String fontFamily;
    private String headingFont;
    private Integer baseFontSize;

    // Domain
    private String customDomain;
    private boolean sslEnabled;
    private String faviconDomain;

    // Contact
    private String supportEmail;
    private String supportPhone;
    private String supportUrl;

    // Legal
    private String privacyPolicyUrl;
    private String termsOfServiceUrl;
    private String refundPolicyUrl;
    private String copyrightText;

    // Custom CSS/JS
    private String customCss;
    private String customJs;

    // Metadata
    private String metaTitle;
    private String metaDescription;
    private String ogImageUrl;
    private String ogTitle;

    // Social Links
    private String facebookUrl;
    private String twitterUrl;
    private String instagramUrl;
    private String linkedinUrl;
    private String youtubeUrl;

    // Feature Flags
    private Map<String, Boolean> featureFlags;

    // Localization
    private Map<String, String> customTranslations;

    @Builder.Default
    private boolean enabled = false;
}
