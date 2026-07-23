package com.kartezy.cmsservice.controller;

import com.kartezy.cmsservice.dto.BannerDto;
import com.kartezy.cmsservice.dto.ContentPageDto;
import com.kartezy.cmsservice.dto.FaqDto;
import com.kartezy.cmsservice.service.CmsService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cms")
@RequiredArgsConstructor
public class CmsController {

    private final CmsService cmsService;

    // Content Pages
    @GetMapping("/pages/{slug}")
    public ResponseEntity<ApiResponse<ContentPageDto>> getPage(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getPageBySlug(slug)));
    }

    @GetMapping("/pages")
    public ResponseEntity<ApiResponse<List<ContentPageDto>>> getAllPages() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getAllPages()));
    }

    @PostMapping("/pages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContentPageDto>> createPage(@RequestBody ContentPageDto request) {
        ContentPageDto page = cmsService.createPage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(page, "Page created"));
    }

    @PostMapping("/pages/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> publishPage(@PathVariable UUID id) {
        cmsService.publishPage(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Page published"));
    }

    // Banners
    @GetMapping("/banners")
    public ResponseEntity<ApiResponse<List<BannerDto>>> getBanners(@RequestParam String position) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getBannersByPosition(position)));
    }

    @PostMapping("/banners")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BannerDto>> createBanner(@RequestBody BannerDto request) {
        BannerDto banner = cmsService.createBanner(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(banner, "Banner created"));
    }

    // FAQs
    @GetMapping("/faqs")
    public ResponseEntity<ApiResponse<List<FaqDto>>> getFaqs() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getActiveFaqs()));
    }

    @GetMapping("/faqs/categories")
    public ResponseEntity<ApiResponse<List<String>>> getFaqCategories() {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getFaqCategories()));
    }

    @GetMapping("/faqs/category/{category}")
    public ResponseEntity<ApiResponse<List<FaqDto>>> getFaqsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(cmsService.getFaqsByCategory(category)));
    }

    @PostMapping("/faqs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FaqDto>> createFaq(@RequestBody FaqDto request) {
        FaqDto faq = cmsService.createFaq(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(faq, "FAQ created"));
    }
}
