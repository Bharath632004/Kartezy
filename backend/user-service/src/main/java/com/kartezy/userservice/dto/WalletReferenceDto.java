package com.kartezy.userservice.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.UUID;
/**
 * Data Transfer Object for WalletReference entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletReferenceDto {
    private UUID id;
    @NotNull
    private UUID customerProfileId;
    @NotBlank
    @Size(max = 100)
    private String walletId; // Reference to wallet service wallet ID
    @NotBlank
    @Size(max = 100)
    private String walletType; // e.g., WALLET, BANK, CARD
    private boolean isPrimary = false;
    private boolean isVerified = false;
}
