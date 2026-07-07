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

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Delete account request entity for tracking account deletion requests.
 */
@Entity
@Table(name = "delete_account_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteAccountRequest extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Column(name = "scheduled_deletion_date")
    private LocalDateTime scheduledDeletionDate;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column(name = "reason")
    @Size(max = 500)
    private String reason;

    @Column(name = "feedback")
    @Size(max = 1000)
    private String feedback;

    /**
     * Status of the delete account request.
     */
    public enum Status {
        PENDING, APPROVED, REJECTED, EXECUTED, CANCELLED
    }
}
