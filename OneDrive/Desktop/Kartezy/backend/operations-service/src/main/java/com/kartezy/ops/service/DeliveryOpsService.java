package com.kartezy.ops.service;

import com.kartezy.ops.constants.OpsConstants;
import com.kartezy.ops.entity.DeliveryOperation;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.DeliveryOperationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeliveryOpsService {

    private final DeliveryOperationRepository deliveryOperationRepository;

    public List<DeliveryOperation> getAllDeliveries() {
        return deliveryOperationRepository.findAll();
    }

    public DeliveryOperation getDeliveryById(Long id) {
        return deliveryOperationRepository.findById(id)
            .orElseThrow(() -> new OpsException("Delivery not found: " + id, "DEL_NOT_FOUND"));
    }

    public DeliveryOperation getDeliveryByOrderId(Long orderId) {
        return deliveryOperationRepository.findByOrderId(orderId).stream().findFirst()
            .orElseThrow(() -> new OpsException("Delivery not found for order: " + orderId, "DEL_NOT_FOUND"));
    }

    public List<DeliveryOperation> getDeliveriesByPartner(Long partnerId) {
        return deliveryOperationRepository.findByDeliveryPartnerId(partnerId);
    }

    public List<DeliveryOperation> getDeliveriesByStatus(String status) {
        return deliveryOperationRepository.findByStatus(status);
    }

    @Transactional
    public DeliveryOperation createDelivery(DeliveryOperation delivery) {
        delivery.setStatus(OpsConstants.DELIVERY_PENDING);
        delivery.setAssignedAt(LocalDateTime.now());
        return deliveryOperationRepository.save(delivery);
    }

    @Transactional
    public DeliveryOperation assignPartner(Long id, Long partnerId, String partnerName) {
        DeliveryOperation delivery = getDeliveryById(id);
        delivery.setDeliveryPartnerId(partnerId);
        delivery.setDeliveryPartnerName(partnerName);
        delivery.setStatus(OpsConstants.DELIVERY_ASSIGNED);
        delivery.setAssignedAt(LocalDateTime.now());
        return deliveryOperationRepository.save(delivery);
    }

    @Transactional
    public DeliveryOperation updateStatus(Long id, String status) {
        DeliveryOperation delivery = getDeliveryById(id);
        delivery.setStatus(status);
        switch (status) {
            case "PICKED_UP" -> delivery.setPickedUpAt(LocalDateTime.now());
            case "DELIVERED" -> {
                delivery.setDeliveredAt(LocalDateTime.now());
                delivery.setActualMinutes((int) java.time.Duration.between(
                    delivery.getAssignedAt(), LocalDateTime.now()).toMinutes());
                delivery.setIsOnTime(delivery.getActualMinutes() <= OpsConstants.SLA_DELIVERY_TRANSIT);
            }
        }
        return deliveryOperationRepository.save(delivery);
    }

    public List<Object[]> getDeliveryCountByStatus() {
        return deliveryOperationRepository.countByStatus();
    }

    public long getOnTimeDeliveryRate(LocalDateTime from, LocalDateTime to) {
        long onTime = deliveryOperationRepository.countOnTimeDeliveries(from, to);
        long total = deliveryOperationRepository.countDeliveriesInRange(from, to);
        return total > 0 ? (onTime * 100 / total) : 100;
    }

    public double getAvgDeliveryTime(LocalDateTime from, LocalDateTime to) {
        return deliveryOperationRepository.avgDeliveryTime(from, to);
    }
}
