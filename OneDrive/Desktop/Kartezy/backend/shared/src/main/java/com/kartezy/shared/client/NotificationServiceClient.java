package com.kartezy.shared.client;

import com.kartezy.shared.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "notification-service", path = "/notifications")
public interface NotificationServiceClient {

    @PostMapping("/send")
    ApiResponse<?> sendNotification(@RequestBody java.util.Map<String, Object> request);
}
