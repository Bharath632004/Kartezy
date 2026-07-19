package com.kartezy.crm.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "notification-service", path = "/api/notifications")
public interface NotificationServiceClient {

    @PostMapping("/email/send")
    Map<String, Object> sendEmail(@RequestBody Map<String, Object> emailRequest);

    @PostMapping("/sms/send")
    Map<String, Object> sendSms(@RequestBody Map<String, Object> smsRequest);

    @PostMapping("/whatsapp/send")
    Map<String, Object> sendWhatsApp(@RequestBody Map<String, Object> whatsappRequest);

    @PostMapping("/push/send")
    Map<String, Object> sendPush(@RequestBody Map<String, Object> pushRequest);

    @PostMapping("/bulk")
    Map<String, Object> sendBulk(@RequestBody Map<String, Object> bulkRequest);
}
