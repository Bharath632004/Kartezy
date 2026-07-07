package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Privacy settings entity for customer's privacy preferences.
 */
@Entity
@Table(name = "privacy_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivacySettings extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "profile_visible")
    private boolean profileVisible = true;

    @Column(name = "activity_visible")
    private boolean activityVisible = true;

    @Column(name = "location_sharing")
    private boolean locationSharing = false;

    @Column(name = "data_personalization")
    private boolean dataPersonalization = true;

    @Column(name = "ad_personalization")
    private boolean adPersonalization = true;

    @Column(name = "show_online_status")
    private boolean showOnlineStatus = true;

    @Column(name = "allow_message_from_everyone")
    private boolean allowMessageFromEveryone = false;

    @Column(name = "allow_friend_request_from_everyone")
    private boolean allowFriendRequestFromEveryone = false;
}
