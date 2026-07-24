package com.kartezy.financeservice.mapper;

import com.kartezy.financeservice.dto.InvoiceDto;
import com.kartezy.financeservice.dto.SettlementDto;
import com.kartezy.financeservice.dto.TransactionDto;
import com.kartezy.financeservice.entity.Invoice;
import com.kartezy.financeservice.entity.Settlement;
import com.kartezy.financeservice.entity.Transaction;

public class FinanceMapper {

    private FinanceMapper() {}

    public static TransactionDto toTransactionDto(Transaction txn) {
        if (txn == null) return null;
        return TransactionDto.builder()
            .id(txn.getId()).transactionNumber(txn.getTransactionNumber())
            .transactionType(txn.getTransactionType()).amount(txn.getAmount())
            .currency(txn.getCurrency()).status(txn.getStatus())
            .userId(txn.getUserId()).merchantId(txn.getMerchantId())
            .orderId(txn.getOrderId()).referenceId(txn.getReferenceId())
            .referenceType(txn.getReferenceType()).description(txn.getDescription())
            .createdAt(txn.getCreatedAt()).completedAt(txn.getCompletedAt()).build();
    }

    public static InvoiceDto toInvoiceDto(Invoice inv) {
        if (inv == null) return null;
        return InvoiceDto.builder()
            .id(inv.getId()).invoiceNumber(inv.getInvoiceNumber())
            .orderId(inv.getOrderId()).merchantId(inv.getMerchantId())
            .userId(inv.getUserId()).amount(inv.getAmount()).tax(inv.getTax())
            .totalAmount(inv.getTotalAmount()).status(inv.getStatus())
            .currency(inv.getCurrency()).notes(inv.getNotes())
            .createdAt(inv.getCreatedAt()).updatedAt(inv.getUpdatedAt())
            .paidAt(inv.getPaidAt()).dueDate(inv.getDueDate()).build();
    }

    public static SettlementDto toSettlementDto(Settlement s) {
        if (s == null) return null;
        return SettlementDto.builder()
            .id(s.getId()).settlementNumber(s.getSettlementNumber())
            .merchantId(s.getMerchantId()).totalAmount(s.getTotalAmount())
            .commissionAmount(s.getCommissionAmount()).netAmount(s.getNetAmount())
            .adjustmentAmount(s.getAdjustmentAmount()).status(s.getStatus())
            .settlementPeriod(s.getSettlementPeriod())
            .bankAccountNumber(s.getBankAccountNumber())
            .bankIfscCode(s.getBankIfscCode()).notes(s.getNotes())
            .createdAt(s.getCreatedAt()).settledAt(s.getSettledAt()).build();
    }
}
