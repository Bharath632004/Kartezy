package com.kartezy.shared.client;

import com.kartezy.shared.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "inventory-service", path = "/inventory")
public interface InventoryServiceClient {

    @PutMapping("/{id}/reserve")
    ApiResponse<?> reserveStock(@PathVariable("id") Long id,
                                 @RequestBody java.util.Map<String, Integer> body);

    @PutMapping("/{id}/release")
    ApiResponse<?> releaseStock(@PathVariable("id") Long id,
                                 @RequestBody java.util.Map<String, Integer> body);

    @GetMapping("/alerts")
    ApiResponse<?> getAlerts(@RequestParam(value = "type", required = false) String type);
}
