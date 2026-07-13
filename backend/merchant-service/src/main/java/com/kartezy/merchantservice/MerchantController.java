package com.kartezy.merchantservice.controller;

import com.kartezy.merchantservice.dto.*;
import com.kartezy.merchantservice.entity.Merchant;
import com.kartezy.merchantservice.repository.MerchantRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/merchants")
@AllArgsConstructor
public class MerchantController {

    private final MerchantRepository merchantRepository;

    @GetMapping
    public ResponseEntity<List<MerchantDto>> getList(@RequestParam java.util.Map<String, String> params) {
        List<Merchant> merchants = merchantRepository.findAll();
        List<MerchantDto> dtos = merchants.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MerchantDto> getDetail(@PathVariable UUID id) {
        return merchantRepository.findById(id)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable UUID id) {
        return merchantRepository.findById(id)
                .map(merchant -> {
                    merchant.setStatus("APPROVED");
                    merchant.setUpdatedAt(java.time.LocalDateTime.now());
                    merchantRepository.save(merchant);
                    return ResponseEntity.ok("Merchant approved");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable UUID id) {
        return merchantRepository.findById(id)
                .map(merchant -> {
                    merchant.setStatus("REJECTED");
                    merchant.setUpdatedAt(java.time.LocalDateTime.now());
                    merchantRepository.save(merchant);
                    return ResponseEntity.ok("Merchant rejected");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<?> suspend(@PathVariable UUID id) {
        return merchantRepository.findById(id)
                .map(merchant -> {
                    merchant.setStatus("SUSPENDED");
                    merchant.setUpdatedAt(java.time.LocalDateTime.now());
                    merchantRepository.save(merchant);
                    return ResponseEntity.ok("Merchant suspended");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activate(@PathVariable UUID id) {
        return merchantRepository.findById(id)
                .map(merchant -> {
                    merchant.setStatus("APPROVED"); // assuming activate means approve
                    merchant.setUpdatedAt(java.time.LocalDateTime.now());
                    merchantRepository.save(merchant);
                    return ResponseEntity.ok("Merchant activated");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/kyc")
    public ResponseEntity<KycDto> getKyc(@PathVariable UUID id) {
        // For demo, return dummy KYC; in real app, fetch from Kyc entity linked to merchant
        return merchantRepository.findById(id)
                .map(m -> {
                    KycDto kyc = KycDto.builder()
                            .status(m.getStatus())
                            .documentType("PASSPORT")
                            .documentNumber("AB1234567")
                            .verifiedBy("admin")
                            .verifiedAt(java.time.LocalDateTime.now())
                            .build();
                    return ResponseEntity.ok(kyc);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<DocumentDto>> getDocuments(@PathVariable UUID id) {
        // Return dummy list
        return merchantRepository.findById(id)
                .map(m -> {
                    DocumentDto doc1 = DocumentDto.builder()
                            .id("doc1")
                            .type("ID_PROOF")
                            .name("passport.pdf")
                            .url("http://example.com/docs/passport.pdf")
                            .verified(true)
                            .build();
                    DocumentDto doc2 = DocumentDto.builder()
                            .id("doc2")
                            .type("ADDRESS_PROOF")
                            .name("utility_bill.pdf")
                            .url("http://example.com/docs/utility_bill.pdf")
                            .verified(true)
                            .build();
                    return ResponseEntity.ok(List.of(doc1, doc2));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/store")
    public ResponseEntity<StoreDto> getStoreDetails(@PathVariable UUID id) {
        return merchantRepository.findById(id)
                .map(m -> {
                    StoreDto store = StoreDto.builder()
                            .name("Sample Store")
                            .description("A sample store")
                            .addressLine1("123 Main St")
                            .addressLine2("")
                            .city("Anytown")
                            .state("NY")
                            .postalCode("12345")
                            .country("USA")
                            .phone("123-456-7890")
                            .email("store@example.com")
                            .website("http://example.com")
                            .logoUrl("http://example.com/logo.png")
                            .bannerUrl("http://example.com/banner.png")
                            .build();
                    return ResponseEntity.ok(store);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/ratings")
    public ResponseEntity<RatingDto> getRatings(@PathVariable UUID id) {
        return merchantRepository.findById(id)
                .map(m -> {
                    RatingDto rating = RatingDto.builder()
                            .averageRating(4.5)
                            .totalReviews(120L)
                            .build();
                    return ResponseEntity.ok(rating);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/revenue")
    public ResponseEntity<RevenueDto> getRevenue(@PathVariable UUID id) {
        return merchantRepository.findById(id)
                .map(m -> {
                    RevenueDto revenue = RevenueDto.builder()
                            .totalRevenue(new java.math.BigDecimal("15000.00"))
                            .monthlyRevenue(new java.math.BigDecimal("1200.00"))
                            .currency("USD")
                            .build();
                    return ResponseEntity.ok(revenue);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/commission")
    public ResponseEntity<CommissionDto> getCommission(@PathVariable UUID id) {
        return merchantRepository.findById(id)
                .map(m -> {
                    CommissionDto commission = CommissionDto.builder()
                            .commissionRate(new java.math.BigDecimal("0.05")) // 5%
                            .earnedCommission(new java.math.BigDecimal("750.00"))
                            .currency("USD")
                            .build();
                    return ResponseEntity.ok(commission);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private MerchantDto toDto(Merchant merchant) {
        return MerchantDto.builder()
                .id(merchant.getId())
                .phoneNumber(merchant.getPhoneNumber())
                .address(merchant.getAddress())
                .status(merchant.getStatus())
                .createdAt(merchant.getCreatedAt())
                .updatedAt(merchant.getUpdatedAt())
                .build();
    }
}