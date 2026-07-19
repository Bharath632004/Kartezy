package com.kartezy.ops.service;

import com.kartezy.ops.constants.OpsConstants;
import com.kartezy.ops.entity.SlaRecord;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.SlaRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SLAService {

    private final SlaRecordRepository slaRecordRepository;

    @Cacheable(value = OpsConstants.CACHE_SLA)
    public List<SlaRecord> getAllSlaRecords() {
        return slaRecordRepository.findAll();
    }

    public SlaRecord getSlaRecordById(Long id) {
        return slaRecordRepository.findById(id)
            .orElseThrow(() -> new OpsException("SLA record not found: " + id, "SLA_NOT_FOUND"));
    }

    public List<SlaRecord> getSlaByType(String slaType) {
        return slaRecordRepository.findBySlaType(slaType);
    }

    public List<SlaRecord> getSlaByStatus(String status) {
        return slaRecordRepository.findBySlaStatus(status);
    }

    @Transactional
    public SlaRecord createSlaRecord(SlaRecord sla) {
        sla.setSlaStatus(OpsConstants.SLA_MET);
        sla.setStartedAt(LocalDateTime.now());
        sla.setDeadlineAt(LocalDateTime.now().plusMinutes(sla.getThresholdMinutes()));
        return slaRecordRepository.save(sla);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_SLA, allEntries = true)
    public SlaRecord completeSla(Long id) {
        SlaRecord sla = getSlaRecordById(id);
        sla.setCompletedAt(LocalDateTime.now());
        if (sla.getDeadlineAt() != null && LocalDateTime.now().isAfter(sla.getDeadlineAt())) {
            sla.setSlaStatus(OpsConstants.SLA_BREACHED);
            sla.setBreachedMinutes((int) java.time.Duration.between(sla.getDeadlineAt(), LocalDateTime.now()).toMinutes());
        } else {
            sla.setSlaStatus(OpsConstants.SLA_MET);
        }
        return slaRecordRepository.save(sla);
    }

    /**
     * Check all active SLAs and mark as breached/at-risk if past deadline
     */
    @Transactional
    public int checkAndUpdateSlaStatus() {
        List<SlaRecord> atRisk = slaRecordRepository.findBySlaStatusAndSlaType("AT_RISK", null);
        int breachedCount = 0;
        LocalDateTime now = LocalDateTime.now();

        for (SlaRecord sla : slaRecordRepository.findBySlaStatus(OpsConstants.SLA_MET)) {
            if (sla.getDeadlineAt() != null) {
                if (now.isAfter(sla.getDeadlineAt())) {
                    sla.setSlaStatus(OpsConstants.SLA_BREACHED);
                    sla.setBreachedMinutes((int) java.time.Duration.between(sla.getDeadlineAt(), now).toMinutes());
                    breachedCount++;
                    slaRecordRepository.save(sla);
                } else if (java.time.Duration.between(now, sla.getDeadlineAt()).toMinutes() < 30) {
                    sla.setSlaStatus(OpsConstants.SLA_AT_RISK);
                    slaRecordRepository.save(sla);
                }
            }
        }
        return breachedCount;
    }

    public long getSlaBreachCount() {
        return slaRecordRepository.countBySlaStatus(OpsConstants.SLA_BREACHED);
    }

    public List<Object[]> getSlaCountByStatus() {
        return slaRecordRepository.countByStatus();
    }

    public List<Object[]> getBreachedByType() {
        return slaRecordRepository.countBreachedByType();
    }
}
