package com.kartezy.walletservice;

import com.kartezy.walletservice.dto.*;
import com.kartezy.walletservice.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletServiceController {
    private final WalletService walletService;

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WalletDto> createWallet(@RequestParam UUID userId,
                                                   @RequestParam(defaultValue = "CUSTOMER") String type) {
        return ResponseEntity.status(HttpStatus.CREATED).body(walletService.createWallet(userId, type));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WalletDto> getWallet(@PathVariable UUID userId) {
        return ResponseEntity.ok(walletService.getWalletByUserId(userId));
    }

    @PostMapping("/topup")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WalletTransactionDto> topUp(@Valid @RequestBody WalletTopUpRequestDto request) {
        return ResponseEntity.ok(walletService.topUp(request));
    }

    @PostMapping("/withdraw")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WalletTransactionDto> withdraw(@Valid @RequestBody WalletWithdrawRequestDto request) {
        return ResponseEntity.ok(walletService.withdraw(request));
    }

    @PostMapping("/spend")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WalletTransactionDto> spend(@RequestParam UUID userId,
                                                       @RequestParam java.math.BigDecimal amount,
                                                       @RequestParam String description,
                                                       @RequestParam String referenceId) {
        return ResponseEntity.ok(walletService.spend(userId, amount, description, referenceId));
    }

    @PostMapping("/cashback")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WalletTransactionDto> addCashback(@RequestParam UUID userId,
                                                             @RequestParam java.math.BigDecimal amount,
                                                             @RequestParam String description) {
        return ResponseEntity.ok(walletService.addCashback(userId, amount, description));
    }

    @PostMapping("/transfer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WalletTransactionDto> transfer(@Valid @RequestBody WalletTransferRequestDto request) {
        return ResponseEntity.ok(walletService.transfer(request));
    }

    @GetMapping("/{userId}/transactions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WalletTransactionDto>> getTransactions(@PathVariable UUID userId) {
        return ResponseEntity.ok(walletService.getTransactions(userId));
    }

    @GetMapping("/overview")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WalletOverviewDto> getOverview() {
        return ResponseEntity.ok(walletService.getOverview());
    }

    @GetMapping("")
    public String home() { return "Welcome to wallet-service"; }

    @GetMapping("/health")
    public String health() { return "wallet-service is healthy"; }
}
