package com.kartezy.shared.enterprise.multitenant;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * Aspect that ensures tenant context is propagated for async operations
 * and service calls.
 */
@Slf4j
@Aspect
@Component
public class TenantAspect {

    @Around("@annotation(org.springframework.scheduling.annotation.Async) || " +
            "@annotation(org.springframework.kafka.annotation.KafkaListener)")
    public Object propagateTenantContext(ProceedingJoinPoint joinPoint) throws Throwable {
        String tenantId = TenantContext.getCurrentTenantId();
        String schema = TenantContext.getCurrentSchema();

        log.debug("Propagating tenant context [{}] for async call: {}",
                tenantId, joinPoint.getSignature().toShortString());

        try {
            return joinPoint.proceed();
        } finally {
            TenantContext.clear();
        }
    }
}
