package com.kartezy.shared.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DeliveryEvent extends BaseEvent {
    private UUID assignmentId;
    private UUID orderId;
    private UUID partnerId;
    private String status;
    private String deliveryOtp;
}
