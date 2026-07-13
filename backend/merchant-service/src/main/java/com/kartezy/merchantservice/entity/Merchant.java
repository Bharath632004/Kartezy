package com.kartezy.merchantservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "merchants", uniqueConstraints = @UniqueConstraint(columnNames = {"email"}))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Merchant {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, SUSPENDED, REJECTED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}