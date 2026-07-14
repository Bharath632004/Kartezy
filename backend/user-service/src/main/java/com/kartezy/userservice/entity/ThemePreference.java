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
 * Theme preference entity for customer's UI theme preferences (light/dark mode, etc.)
 */
@Entity
@Table(name = "theme_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThemePreference extends AuditableEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;
    @NotBlank
    @Size(max = 20)
    @Column(name = "theme_mode", length = 20)
    private String themeMode; // e.g., LIGHT, DARK, SYSTEM
    @NotBlank
    @Size(max = 20)
    @Column(name = "primary_color", length = 20)
    private String primaryColor; // e.g., #FF5733
    @NotBlank
    @Size(max = 20)
    @Column(name = "secondary_color", length = 20)
    private String secondaryColor; // e.g., #33FF57
    @NotBlank
    @Size(max = 20)
    @Column(name = "font_size", length = 20)
    private String fontSize; // e.g., SMALL, MEDIUM, LARGE
    @NotBlank
    @Size(max = 20)
    @Column(name = "font_family", length = 20)
    private String fontFamily; // e.g., DEFAULT, SERIF, SANS_SERIF
}
