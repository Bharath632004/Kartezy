package com.kartezy.finance.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "merchant-service", path = "/api/merchants")
public interface MerchantServiceClient {

    @GetMapping("/{merchantId}")
    Map<String, Object> getMerchant(@PathVariable("merchantId") Long merchantId);

    @GetMapping("/{merchantId}/bank-accounts")
    java.util.List<Map<String, Object>> getMerchantBankAccounts(@PathVariable("merchantId") Long merchantId);
}
