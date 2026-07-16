package com.kartezy.shared.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Feign client for the OCR Service.
 */
@FeignClient(name = "ocr-service", path = "/ocr")
public interface OcrServiceClient {

    @PostMapping("/extract")
    Map<String, Object> extractText(@RequestPart("file") MultipartFile file) throws IOException;

    @PostMapping("/extract/structured")
    Map<String, Object> extractStructuredData(@RequestPart("file") MultipartFile file,
                                              @RequestParam("documentType") String documentType) throws IOException;

    @PostMapping("/validate")
    Map<String, Object> validateDocument(@RequestPart("file") MultipartFile file,
                                         @RequestParam("documentType") String documentType) throws IOException;
}