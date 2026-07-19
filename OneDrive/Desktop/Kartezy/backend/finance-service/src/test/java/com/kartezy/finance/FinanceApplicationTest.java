package com.kartezy.finance;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class FinanceApplicationTest {

    @Test
    void contextLoads() {
        // Verify the application context loads with test profile
        // @SpringBootTest annotation handles context loading
    }
}
