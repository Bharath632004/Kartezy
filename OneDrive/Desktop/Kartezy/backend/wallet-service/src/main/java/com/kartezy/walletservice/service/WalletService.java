package com.kartezy.walletservice.service;

import com.kartezy.walletservice.dto.*;
import com.kartezy.walletservice.entity.*;
import com.kartezy.walletservice.entity.WalletTransaction.TransactionCategory;
import com.kartezy.walletservice.entity.WalletTransaction.TransactionStatus;
import com.kartezy.walletservice.entity.WalletTransaction.TransactionType;
import com.kartezy.walletservice.repository.*;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    @Transactional
    public WalletDto createWallet(UUID userId, String walletTypeStr) {
        if (walletRepository.findByUserId(userId).isPresent()) {
            throw new BadRequestException("Wallet already exists for user");
        }

        Wallet.WalletType walletType;
        try {
            walletType = Wallet.WalletType.valueOf(walletTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            walletType = Wallet.WalletType.CUSTOMER;
        }

        Wallet wallet = Wallet.builder()
            .userId(userId)
            .walletType(walletType)
            .balance(BigDecimal.ZERO)
            .totalDeposited(BigDecimal.ZERO)
            .totalWithdrawn(BigDecimal.ZERO)
            .totalSpent(BigDecimal.ZERO)
            .cashbackEarned(BigDecimal.ZERO)
            .isActive(true)
            .isBlocked(false)
            .transactionCount(0L)
            .build();

        wallet = walletRepository.save(wallet);
        log.info("Wallet created for user: {}", userId);
        return toDto(wallet);
    }

    @Transactional
    public WalletTransactionDto topUp(WalletTopUpRequestDto request) {
        Wallet wallet = walletRepository.findByUserId(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user"));

        if (!wallet.getIsActive() || wallet.getIsBlocked()) {
            throw new BadRequestException("Wallet is not active");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be positive");
        }

        WalletTransaction transaction = WalletTransaction.builder()
            .walletId(wallet.getId())
            .userId(request.getUserId())
            .transactionType(TransactionType.CREDIT)
            .category(TransactionCategory.TOP_UP)
            .amount(request.getAmount())
            .balanceBefore(wallet.getBalance())
            .balanceAfter(wallet.getBalance().add(request.getAmount()))
            .description(request.getDescription() != null ? request.getDescription() : "Wallet top-up")
            .referenceType(request.getPaymentMethod())
            .status(TransactionStatus.PENDING)
            .build();

        transaction = transactionRepository.save(transaction);

        wallet.setBalance(wallet.getBalance().add(request.getAmount()));
        wallet.setTotalDeposited(wallet.getTotalDeposited().add(request.getAmount()));
        wallet.setTransactionCount(wallet.getTransactionCount() + 1);
        walletRepository.save(wallet);

        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setCompletedAt(LocalDateTime.now());
        transaction = transactionRepository.save(transaction);

        log.info("Wallet top-up: {} for user: {}", request.getAmount(), request.getUserId());
        return toTransactionDto(transaction);
    }

    @Transactional
    public WalletTransactionDto withdraw(WalletWithdrawRequestDto request) {
        Wallet wallet = walletRepository.findByUserId(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user"));

        if (!wallet.getIsActive() || wallet.getIsBlocked()) {
            throw new BadRequestException("Wallet is not active");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be positive");
        }

        if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BadRequestException("Insufficient balance");
        }

        WalletTransaction transaction = WalletTransaction.builder()
            .walletId(wallet.getId())
            .userId(request.getUserId())
            .transactionType(TransactionType.DEBIT)
            .category(TransactionCategory.WITHDRAWAL)
            .amount(request.getAmount())
            .balanceBefore(wallet.getBalance())
            .balanceAfter(wallet.getBalance().subtract(request.getAmount()))
            .description(request.getDescription() != null ? request.getDescription() : "Wallet withdrawal")
            .referenceId(request.getBankAccountNumber())
            .referenceType("BANK_TRANSFER")
            .status(TransactionStatus.PENDING)
            .build();

        transaction = transactionRepository.save(transaction);

        wallet.setBalance(wallet.getBalance().subtract(request.getAmount()));
        wallet.setTotalWithdrawn(wallet.getTotalWithdrawn().add(request.getAmount()));
        wallet.setTransactionCount(wallet.getTransactionCount() + 1);
        walletRepository.save(wallet);

        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setCompletedAt(LocalDateTime.now());
        transaction = transactionRepository.save(transaction);

        log.info("Wallet withdrawal: {} for user: {}", request.getAmount(), request.getUserId());
        return toTransactionDto(transaction);
    }

    @Transactional
    public WalletTransactionDto spend(UUID userId, BigDecimal amount, String description, String referenceId) {
        Wallet wallet = walletRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user"));

        if (!wallet.getIsActive() || wallet.getIsBlocked()) {
            throw new BadRequestException("Wallet is not active");
        }

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new BadRequestException("Insufficient balance");
        }

        WalletTransaction transaction = WalletTransaction.builder()
            .walletId(wallet.getId())
            .userId(userId)
            .transactionType(TransactionType.DEBIT)
            .category(TransactionCategory.PAYMENT)
            .amount(amount)
            .balanceBefore(wallet.getBalance())
            .balanceAfter(wallet.getBalance().subtract(amount))
            .description(description)
            .referenceId(referenceId)
            .referenceType("ORDER_PAYMENT")
            .status(TransactionStatus.COMPLETED)
            .completedAt(LocalDateTime.now())
            .build();

        transaction = transactionRepository.save(transaction);

        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setTotalSpent(wallet.getTotalSpent().add(amount));
        wallet.setTransactionCount(wallet.getTransactionCount() + 1);
        walletRepository.save(wallet);

        return toTransactionDto(transaction);
    }

    @Transactional
    public WalletTransactionDto addCashback(UUID userId, BigDecimal amount, String description) {
        Wallet wallet = walletRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user"));

        WalletTransaction transaction = WalletTransaction.builder()
            .walletId(wallet.getId()).userId(userId)
            .transactionType(TransactionType.CREDIT)
            .category(TransactionCategory.CASHBACK)
            .amount(amount)
            .balanceBefore(wallet.getBalance())
            .balanceAfter(wallet.getBalance().add(amount))
            .description(description)
            .status(TransactionStatus.COMPLETED)
            .completedAt(LocalDateTime.now())
            .build();

        transaction = transactionRepository.save(transaction);

        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setCashbackEarned(wallet.getCashbackEarned().add(amount));
        wallet.setTransactionCount(wallet.getTransactionCount() + 1);
        walletRepository.save(wallet);

        return toTransactionDto(transaction);
    }

    @Transactional
    public WalletTransactionDto transfer(WalletTransferRequestDto request) {
        Wallet fromWallet = walletRepository.findByUserId(request.getFromUserId())
            .orElseThrow(() -> new ResourceNotFoundException("Sender wallet not found"));
        Wallet toWallet = walletRepository.findByUserId(request.getToUserId())
            .orElseThrow(() -> new ResourceNotFoundException("Recipient wallet not found"));

        if (fromWallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BadRequestException("Insufficient balance");
        }

        // Debit from sender
        WalletTransaction debitTx = WalletTransaction.builder()
            .walletId(fromWallet.getId()).userId(request.getFromUserId())
            .transactionType(TransactionType.DEBIT)
            .category(TransactionCategory.PAYMENT)
            .amount(request.getAmount())
            .balanceBefore(fromWallet.getBalance())
            .balanceAfter(fromWallet.getBalance().subtract(request.getAmount()))
            .description(request.getDescription() != null ? request.getDescription() : "Transfer to user")
            .referenceType("WALLET_TRANSFER")
            .status(TransactionStatus.COMPLETED)
            .completedAt(LocalDateTime.now())
            .build();
        transactionRepository.save(debitTx);

        fromWallet.setBalance(fromWallet.getBalance().subtract(request.getAmount()));
        fromWallet.setTransactionCount(fromWallet.getTransactionCount() + 1);
        walletRepository.save(fromWallet);

        // Credit to recipient
        WalletTransaction creditTx = WalletTransaction.builder()
            .walletId(toWallet.getId()).userId(request.getToUserId())
            .transactionType(TransactionType.CREDIT)
            .category(TransactionCategory.PAYMENT)
            .amount(request.getAmount())
            .balanceBefore(toWallet.getBalance())
            .balanceAfter(toWallet.getBalance().add(request.getAmount()))
            .description("Transfer from user")
            .referenceType("WALLET_TRANSFER")
            .status(TransactionStatus.COMPLETED)
            .completedAt(LocalDateTime.now())
            .build();
        transactionRepository.save(creditTx);

        toWallet.setBalance(toWallet.getBalance().add(request.getAmount()));
        toWallet.setTransactionCount(toWallet.getTransactionCount() + 1);
        walletRepository.save(toWallet);

        return toTransactionDto(debitTx);
    }

    public WalletDto getWalletByUserId(UUID userId) {
        return walletRepository.findByUserId(userId)
            .map(this::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user"));
    }

    public List<WalletTransactionDto> getTransactions(UUID userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toTransactionDto).collect(Collectors.toList());
    }

    public WalletOverviewDto getOverview() {
        List<Wallet> wallets = walletRepository.findAll();
        long total = wallets.size();
        long active = wallets.stream().filter(Wallet::getIsActive).count();
        long blocked = wallets.stream().filter(Wallet::getIsBlocked).count();
        BigDecimal totalBalance = wallets.stream().map(Wallet::getBalance).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalDeposited = wallets.stream().map(Wallet::getTotalDeposited).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalWithdrawn = wallets.stream().map(Wallet::getTotalWithdrawn).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalSpent = wallets.stream().map(Wallet::getTotalSpent).reduce(BigDecimal.ZERO, BigDecimal::add);
        long pending = transactionRepository.findByStatus(TransactionStatus.PENDING).size();

        return WalletOverviewDto.builder()
            .totalWallets(total).activeWallets(active).blockedWallets(blocked)
            .totalBalance(totalBalance).totalDeposited(totalDeposited)
            .totalWithdrawn(totalWithdrawn).totalSpent(totalSpent)
            .pendingTransactions(pending).build();
    }

    private WalletDto toDto(Wallet w) {
        return WalletDto.builder().id(w.getId()).userId(w.getUserId())
            .walletType(w.getWalletType().name()).balance(w.getBalance())
            .totalDeposited(w.getTotalDeposited()).totalWithdrawn(w.getTotalWithdrawn())
            .totalSpent(w.getTotalSpent()).cashbackEarned(w.getCashbackEarned())
            .isActive(w.getIsActive()).isBlocked(w.getIsBlocked())
            .transactionCount(w.getTransactionCount()).createdAt(w.getCreatedAt()).build();
    }

    private WalletTransactionDto toTransactionDto(WalletTransaction t) {
        return WalletTransactionDto.builder().id(t.getId()).walletId(t.getWalletId())
            .userId(t.getUserId()).transactionReference(t.getTransactionReference())
            .transactionType(t.getTransactionType().name()).category(t.getCategory().name())
            .amount(t.getAmount()).balanceBefore(t.getBalanceBefore())
            .balanceAfter(t.getBalanceAfter()).description(t.getDescription())
            .referenceId(t.getReferenceId()).referenceType(t.getReferenceType())
            .status(t.getStatus().name()).failureReason(t.getFailureReason())
            .createdAt(t.getCreatedAt()).completedAt(t.getCompletedAt()).build();
    }
}
