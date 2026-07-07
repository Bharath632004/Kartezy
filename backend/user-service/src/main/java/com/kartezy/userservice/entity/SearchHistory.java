package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Search history entity for tracking customer's search queries.
 */
@Entity
@Table(name = "search_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchHistory extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @NotBlank
    @Size(max = 255)
    @Column(name = "query", length = 255)
    private String query;

    @Column(name = "search_time")
    private LocalDateTime searchTime;

    @Column(name = "results_count")
    private Integer resultsCount;

    @Column(name = "clicked_result_id")
    private String clickedResultId; // ID of the clicked result (product, store, etc.)

    @Column(name = "clicked_result_type")
    @Size(max = 50)
    private String clickedResultType; // e.g., PRODUCT, STORE, CATEGORY
}
