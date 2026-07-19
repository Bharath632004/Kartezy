package com.kartezy.ops.client;

import com.kartezy.ops.dto.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", path = "/api/notifications")
public interface NotificationServiceClient {

    @PostMapping("/send")
    void sendNotification(@RequestBody NotificationRequest request);

    @PostMapping("/send/email")
    void sendEmail(@RequestBody NotificationRequest request);

    @PostMapping("/send/sms")
    void sendSms(@RequestBody NotificationRequest request);
}
