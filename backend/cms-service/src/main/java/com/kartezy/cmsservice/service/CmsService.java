package com.kartezy.cmsservice.service;

import com.kartezy.cmsservice.dto.BannerDto;
import com.kartezy.cmsservice.dto.ContentPageDto;
import com.kartezy.cmsservice.dto.FaqDto;
import com.kartezy.cmsservice.entity.Banner;
import com.kartezy.cmsservice.entity.ContentPage;
import com.kartezy.cmsservice.entity.Faq;
import com.kartezy.cmsservice.repository.BannerRepository;
import com.kartezy.cmsservice.repository.ContentPageRepository;
import com.kartezy.cmsservice.repository.FaqRepository;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CmsService {

    private final ContentPageRepository pageRepository;
    private final BannerRepository bannerRepository;
    private final FaqRepository faqRepository;

    // ========== Content Pages ==========

    public ContentPageDto getPageBySlug(String slug) {
        ContentPage page = pageRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Page not found: " + slug));
        return toPageDto(page);
    }

    public List<ContentPageDto> getAllPages() {
        return pageRepository.findByActiveTrueAndPublishedTrue().stream()
            .map(this::toPageDto).collect(Collectors.toList());
    }

    @Transactional
    public ContentPageDto createPage(ContentPageDto request) {
        if (pageRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Slug already exists: " + request.getSlug());
        }
        ContentPage page = ContentPage.builder()
            .slug(request.getSlug())
            .title(request.getTitle())
            .content(request.getContent())
            .metaDescription(request.getMetaDescription())
            .metaKeywords(request.getMetaKeywords())
            .active(true)
            .published(false)
            .createdBy(request.getCreatedBy())
            .build();
        page = pageRepository.save(page);
        log.info("Content page created: {}", page.getSlug());
        return toPageDto(page);
    }

    @Transactional
    public void publishPage(UUID id) {
        ContentPage page = pageRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Page not found: " + id));
        page.setPublished(true);
        page.setPublishedAt(LocalDateTime.now());
        pageRepository.save(page);
        log.info("Content page published: {}", page.getSlug());
    }

    // ========== Banners ==========

    public List<BannerDto> getBannersByPosition(String position) {
        return bannerRepository.findByActiveTrueAndPositionOrderBySortOrderAsc(position)
            .stream().map(this::toBannerDto).collect(Collectors.toList());
    }

    @Transactional
    public BannerDto createBanner(BannerDto request) {
        Banner banner = Banner.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .imageUrl(request.getImageUrl())
            .linkUrl(request.getLinkUrl())
            .position(request.getPosition())
            .sortOrder(request.getSortOrder())
            .active(true)
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .build();
        banner = bannerRepository.save(banner);
        log.info("Banner created: {}", banner.getTitle());
        return toBannerDto(banner);
    }

    // ========== FAQs ==========

    public List<FaqDto> getActiveFaqs() {
        return faqRepository.findByActiveTrueOrderBySortOrderAsc()
            .stream().map(this::toFaqDto).collect(Collectors.toList());
    }

    public List<FaqDto> getFaqsByCategory(String category) {
        return faqRepository.findByCategoryAndActiveTrueOrderBySortOrderAsc(category)
            .stream().map(this::toFaqDto).collect(Collectors.toList());
    }

    public List<String> getFaqCategories() {
        return faqRepository.findDistinctCategoryBy();
    }

    @Transactional
    public FaqDto createFaq(FaqDto request) {
        Faq faq = Faq.builder()
            .question(request.getQuestion())
            .answer(request.getAnswer())
            .category(request.getCategory())
            .sortOrder(request.getSortOrder())
            .active(true)
            .build();
        faq = faqRepository.save(faq);
        log.info("FAQ created: {}", faq.getQuestion());
        return toFaqDto(faq);
    }

    // ========== Mappers ==========

    private ContentPageDto toPageDto(ContentPage page) {
        return ContentPageDto.builder()
            .id(page.getId()).slug(page.getSlug()).title(page.getTitle())
            .content(page.getContent()).metaDescription(page.getMetaDescription())
            .metaKeywords(page.getMetaKeywords()).active(page.isActive())
            .published(page.isPublished()).createdBy(page.getCreatedBy())
            .createdAt(page.getCreatedAt()).updatedAt(page.getUpdatedAt())
            .publishedAt(page.getPublishedAt()).build();
    }

    private BannerDto toBannerDto(Banner banner) {
        return BannerDto.builder()
            .id(banner.getId()).title(banner.getTitle())
            .description(banner.getDescription()).imageUrl(banner.getImageUrl())
            .linkUrl(banner.getLinkUrl()).position(banner.getPosition())
            .sortOrder(banner.getSortOrder()).active(banner.isActive())
            .startDate(banner.getStartDate()).endDate(banner.getEndDate())
            .createdAt(banner.getCreatedAt()).build();
    }

    private FaqDto toFaqDto(Faq faq) {
        return FaqDto.builder()
            .id(faq.getId()).question(faq.getQuestion()).answer(faq.getAnswer())
            .category(faq.getCategory()).sortOrder(faq.getSortOrder())
            .active(faq.isActive()).createdAt(faq.getCreatedAt()).build();
    }
}
