package com.kartezy.cmsservice.controller;
import com.kartezy.cmsservice.entity.*;
import com.kartezy.cmsservice.repository.*;
import com.kartezy.shared.dto.ApiResponse;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/cms") @RequiredArgsConstructor
public class CmsController {
    private final CmsPageRepository pageRepository;
    private final CmsBannerRepository bannerRepository;

    // ========== Pages ==========
    @PostMapping("/pages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CmsPage> createPage(@RequestBody CmsPage page) {
        page.setCreatedAt(LocalDateTime.now()); page.setUpdatedAt(LocalDateTime.now());
        if (page.getStatus() == null) page.setStatus("DRAFT");
        return ResponseEntity.status(HttpStatus.CREATED).body(pageRepository.save(page));
    }

    @GetMapping("/pages")
    @Cacheable(value = "cmsPages")
    public ResponseEntity<List<CmsPage>> getPages(@RequestParam(defaultValue = "PUBLISHED") String status) {
        return ResponseEntity.ok(pageRepository.findByStatusOrderBySortOrderAsc(status));
    }

    @GetMapping("/pages/{id}")
    @Cacheable(value = "cmsPages", key = "#id")
    public ResponseEntity<CmsPage> getPage(@PathVariable UUID id) {
        return ResponseEntity.ok(pageRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Page not found")));
    }

    @PutMapping("/pages/{id}")
    @CacheEvict(value = "cmsPages", allEntries = true)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CmsPage> updatePage(@PathVariable UUID id, @RequestBody CmsPage update) {
        CmsPage page = pageRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Page not found"));
        page.setTitle(update.getTitle()); page.setContent(update.getContent());
        page.setSlug(update.getSlug()); page.setStatus(update.getStatus());
        page.setMetaTitle(update.getMetaTitle()); page.setMetaDescription(update.getMetaDescription());
        page.setMetaKeywords(update.getMetaKeywords()); page.setTemplate(update.getTemplate());
        page.setSortOrder(update.getSortOrder()); page.setPublished(update.isPublished());
        return ResponseEntity.ok(pageRepository.save(page));
    }

    @DeleteMapping("/pages/{id}")
    @CacheEvict(value = "cmsPages", allEntries = true)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePage(@PathVariable UUID id) {
        pageRepository.deleteById(id); return ResponseEntity.noContent().build();
    }

    // ========== Banners ==========
    @PostMapping("/banners")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CmsBanner> createBanner(@RequestBody CmsBanner banner) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bannerRepository.save(banner));
    }

    @GetMapping("/banners/{position}")
    @Cacheable(value = "cmsBanners", key = "#position")
    public ResponseEntity<List<CmsBanner>> getBanners(@PathVariable String position) {
        return ResponseEntity.ok(bannerRepository.findByIsActiveTrueAndPositionOrderBySortOrderAsc(position));
    }

    @DeleteMapping("/banners/{id}")
    @CacheEvict(value = "cmsBanners", allEntries = true)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBanner(@PathVariable UUID id) {
        bannerRepository.deleteById(id); return ResponseEntity.noContent().build();
    }
}
