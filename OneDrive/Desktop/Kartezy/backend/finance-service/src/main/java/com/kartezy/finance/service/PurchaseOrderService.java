package com.kartezy.finance.service;

import com.kartezy.finance.constants.AuditAction;
import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.entity.PurchaseOrder;
import com.kartezy.finance.entity.PurchaseOrderItem;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.PurchaseOrderItemRepository;
import com.kartezy.finance.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository poRepository;
    private final PurchaseOrderItemRepository poItemRepository;
    private final AuditService auditService;

    @Transactional
    public PurchaseOrder createPurchaseOrder(PurchaseOrder po, List<PurchaseOrderItem> items) {
        String poNumber = "PO-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
            + "-" + System.currentTimeMillis() % 10000;
        po.setPoNumber(poNumber);
        po.setStatus("DRAFT");

        BigDecimal subtotal = items.stream()
            .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        po.setSubtotal(subtotal);

        BigDecimal taxAmount = items.stream()
            .map(i -> i.getTaxAmount() != null ? i.getTaxAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        po.setTaxAmount(taxAmount);

        BigDecimal discount = items.stream()
            .map(i -> i.getDiscountAmount() != null ? i.getDiscountAmount() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        po.setDiscountAmount(discount);

        BigDecimal total = subtotal.add(taxAmount).add(
            po.getShippingCharges() != null ? po.getShippingCharges() : BigDecimal.ZERO)
            .subtract(discount);
        po.setTotalAmount(total);
        po.setBalanceAmount(total);
        po.setPaidAmount(BigDecimal.ZERO);

        PurchaseOrder saved = poRepository.save(po);

        for (PurchaseOrderItem item : items) {
            item.setPurchaseOrder(saved);
            poItemRepository.save(item);
        }

        auditService.log(AuditAction.CREATE, FinanceConstants.ENTITY_PURCHASE_ORDER,
            saved.getId(), saved.getPoNumber(), "System",
            null, "PO created: " + saved.getPoNumber());

        return saved;
    }

    @Transactional
    public PurchaseOrder approvePurchaseOrder(Long poId, String approvedBy) {
        PurchaseOrder po = poRepository.findById(poId)
            .orElseThrow(() -> new FinanceException("Purchase order not found: " + poId));
        po.setStatus("APPROVED");
        po.setApprovedBy(approvedBy);
        po.setApprovedAt(java.time.LocalDateTime.now());
        return poRepository.save(po);
    }

    @Transactional
    public PurchaseOrder receivePurchaseOrder(Long poId) {
        PurchaseOrder po = poRepository.findById(poId)
            .orElseThrow(() -> new FinanceException("Purchase order not found: " + poId));

        po.setDeliveryDate(LocalDate.now());
        po.setStatus("RECEIVED");

        List<PurchaseOrderItem> items = poItemRepository.findByPurchaseOrderId(poId);
        for (PurchaseOrderItem item : items) {
            item.setReceivedQuantity(item.getQuantity());
            poItemRepository.save(item);
        }

        return poRepository.save(po);
    }

    @Transactional(readOnly = true)
    public Page<PurchaseOrder> getPurchaseOrders(Long vendorId, String status, Pageable pageable) {
        if (vendorId != null) return poRepository.findByVendorIdOrderByOrderDateDesc(vendorId, pageable);
        if (status != null) return poRepository.findByStatus(status, pageable);
        return poRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public PurchaseOrder getPurchaseOrder(Long id) {
        return poRepository.findById(id)
            .orElseThrow(() -> new FinanceException("Purchase order not found: " + id));
    }
}
