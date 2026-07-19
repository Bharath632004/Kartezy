package com.kartezy.crm.service;

import com.kartezy.crm.entity.CustomerProfile;
import com.kartezy.crm.entity.CustomerSegment;
import com.kartezy.crm.exception.CrmException;
import com.kartezy.crm.repository.CustomerProfileRepository;
import com.kartezy.crm.repository.CustomerSegmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SegmentationService {

    private final CustomerSegmentRepository segmentRepository;
    private final CustomerProfileRepository customerRepository;

    @Transactional
    public CustomerSegment createSegment(CustomerSegment segment) {
        segment.setMemberCount(0);
        return segmentRepository.save(segment);
    }

    @Transactional
    @CacheEvict(value = "segments", key = "#segment.id")
    public void evaluateSegment(Long segmentId) {
        CustomerSegment segment = segmentRepository.findById(segmentId)
            .orElseThrow(() -> new CrmException("Segment not found: " + segmentId));

        // Parse criteria and evaluate members
        List<CustomerProfile> allCustomers = customerRepository.findAll();
        List<CustomerProfile> matchingCustomers = filterByCriteria(allCustomers, segment.getCriteriaJson());

        segment.setMemberCount(matchingCustomers.size());
        segment.setLastRefreshedAt(java.time.LocalDateTime.now());
        segmentRepository.save(segment);

        log.info("Segment '{}' evaluated: {} members", segment.getSegmentName(), matchingCustomers.size());
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "segments")
    public List<CustomerSegment> getAllSegments() {
        return segmentRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<Long> getSegmentCustomerIds(Long segmentId) {
        CustomerSegment segment = segmentRepository.findById(segmentId)
            .orElseThrow(() -> new CrmException("Segment not found: " + segmentId));

        List<CustomerProfile> allCustomers = customerRepository.findAll();
        List<CustomerProfile> matching = filterByCriteria(allCustomers, segment.getCriteriaJson());

        return matching.stream().map(CustomerProfile::getUserId).toList();
    }

    private List<CustomerProfile> filterByCriteria(List<CustomerProfile> customers, String criteriaJson) {
        // Simplified: In production, parse JSON criteria with operators
        // For now return all customers as segments would be evaluated by the criteria
        return new ArrayList<>(customers);
    }
}
