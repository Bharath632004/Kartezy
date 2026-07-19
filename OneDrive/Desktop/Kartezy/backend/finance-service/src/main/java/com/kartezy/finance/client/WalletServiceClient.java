package com.kartezy.finance.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "wallet-service", path = "/api/wallets")
public interface WalletServiceClient {

    @GetMapping("/{walletId}")
    Map<String, Object> getWallet(@PathVariable("walletId") Long walletId);

    @GetMapping("/merchant/{merchantId}")
    Map<String, Object> getMerchantWallet(@PathVariable("merchantId") Long merchantId);

    @GetMapping("/customer/{customerId}")
    Map<String, Object> getCustomerWallet(@PathVariable("customerId") Long customerId);

    @GetMapping("/{walletId}/transactions")
    java.util.List<Map<String, Object>> getWalletTransactions(
        @PathVariable("walletId") Long walletId,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "20") int size);
}
