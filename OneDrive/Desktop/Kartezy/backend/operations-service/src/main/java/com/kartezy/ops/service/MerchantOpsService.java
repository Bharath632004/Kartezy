package com.kartezy.ops.service;

import com.kartezy.ops.entity.City;
import com.kartezy.ops.entity.MerchantOperation;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.MerchantOperationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MerchantOpsService {

    private final MerchantOperationRepository merchantOperationRepository;
    private final CityService cityService;

    public MerchantOperation getMerchantOperation(Long merchantId) {
        return merchantOperationRepository.findByMerchantId(merchantId)
            .orElseThrow(() -> new OpsException("Merchant operation not found: " + merchantId, "MO_NOT_FOUND"));
    }

    public List<MerchantOperation> getMerchantsByVerificationStatus(String status) {
        return merchantOperationRepository.findByVerificationStatus(status);
    }

    public List<MerchantOperation> getMerchantsByCity(Long cityId) {
        return merchantOperationRepository.findByCityId(cityId);
    }

    public List<MerchantOperation> getActiveMerchants() {
        return merchantOperationRepository.findByIsActiveTrue();
    }

    public List<MerchantOperation> getPendingVerifications() {
        return merchantOperationRepository.findByVerificationStatus("PENDING_VERIFICATION");
    }

    @Transactional
    public MerchantOperation createMerchantOperation(MerchantOperation mo) {
        if (merchantOperationRepository.findByMerchantId(mo.getMerchantId()).isPresent()) {
            throw new OpsException("Merchant already registered in ops: " + mo.getMerchantId(), "MO_EXISTS");
        }
        City city = cityService.getCityById(mo.getCity().getId());
        mo.setCity(city);
        return merchantOperationRepository.save(mo);
    }

    @Transactional
    public MerchantOperation verifyMerchant(Long merchantId, String verifiedBy) {
        MerchantOperation mo = getMerchantOperation(merchantId);
        mo.setVerificationStatus("VERIFIED");
        mo.setVerifiedAt(LocalDateTime.now());
        mo.setVerifiedBy(verifiedBy);
        return merchantOperationRepository.save(mo);
    }

    @Transactional
    public MerchantOperation suspendMerchant(Long merchantId, String reason) {
        MerchantOperation mo = getMerchantOperation(merchantId);
        mo.setVerificationStatus("SUSPENDED");
        mo.setRemarks(reason);
        mo.setIsActive(false);
        return merchantOperationRepository.save(mo);
    }

    @Transactional
    public MerchantOperation updateSlaMetrics(Long merchantId, boolean onTime) {
        MerchantOperation mo = getMerchantOperation(merchantId);
        mo.setSlaBreaches(mo.getSlaBreaches() + (onTime ? 0 : 1));
        long totalDeliveries = mo.getTotalOrders();
        long onTimeDeliveries = onTime ? (long)(mo.getOnTimeDeliveryRate() * totalDeliveries / 100 + 1)
                                       : (long)(mo.getOnTimeDeliveryRate() * totalDeliveries / 100);
        mo.setOnTimeDeliveryRate((double) onTimeDeliveries / (totalDeliveries + 1) * 100);
        return merchantOperationRepository.save(mo);
    }

    public List<Object[]> getMerchantCountByVerificationStatus() {
        return merchantOperationRepository.countByVerificationStatus();
    }

    public List<Object[]> getMerchantCountByBusinessType() {
        return merchantOperationRepository.countByBusinessType();
    }
}
