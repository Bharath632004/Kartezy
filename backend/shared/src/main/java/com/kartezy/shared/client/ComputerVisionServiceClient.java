package com.kartezy.shared.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Feign client for the Computer Vision Service.
 */
@FeignClient(name = "computer-vision-service", path = "/computer-vision")
public interface ComputerVisionServiceClient {

    @PostMapping("/detect/objects")
    Map<String, Object> detectObjects(@RequestParam("file") MultipartFile file) throws IOException;

    @PostMapping("/recognize/product")
    Map<String, Object> recognizeProduct(@RequestParam("file") MultipartFile file) throws IOException;

    @PostMapping("/similarity")
    Map<String, Object> imageSimilarity(@RequestParam("file1") MultipartFile file1,
                                        @RequestParam("file2") MultipartFile file2) throws IOException;

    @PostMapping("/duplicate/detection")
    Map<String, Object> detectDuplicateProducts(@RequestParam("file") MultipartFile file) throws IOException;

    @PostMapping("/shelf/analysis")
    Map<String, Object> analyzeShelfImage(@RequestParam("file") MultipartFile file) throws IOException;
}