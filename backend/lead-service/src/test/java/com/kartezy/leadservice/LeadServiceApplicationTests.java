package com.kartezy.leadservice;

import com.kartezy.shared.enterprise.multitenant.TenantService;
import com.kartezy.shared.security.audit.AuditEventRepository;
import com.kartezy.shared.security.audit.EnhancedAuditEventRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest(properties = {
    "eureka.client.enabled=false",
    "spring.cloud.config.enabled=false",
    "spring.cloud.discovery.enabled=false",
    "springdoc.api-docs.enabled=false",
    "springdoc.swagger-ui.enabled=false"
})
class LeadServiceApplicationTests {

    @MockBean
    private TenantService tenantService;

    @MockBean
    private EnhancedAuditEventRepository enhancedAuditEventRepository;

    @MockBean
    private AuditEventRepository auditEventRepository;

    @Test
    void contextLoads() {
    }
}