package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Email;
import lombok.*;
import com.kartezy.shared.audit.AuditableEntity;

/**
 * Language preference entity for customer's language and locale settings.
 */
@Entity
@Table(name = "language_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguagePreference extends AuditableEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @NotBlank
    @Size(max = 10)
    @Column(name = "language_code", length = 10)
    private String languageCode; // e.g., en, es, fr

    @NotBlank
    @Size(max = 50)
    @Column(name = "language_name", length = 50)
    private String languageName; // e.g., English, Spanish, French

    @NotBlank
    @Size(max = 10)
    @Column(name = "country_code", length = 10)
    private String countryCode; // e.g., US, ES, FR

    @NotBlank
    @Size(max = 50)
    @Column(name = "country_name", length = 50)
    private String countryName; // e.g., United States, Spain, France
}
