package com.kartezy.shared.ai;

import com.kartezy.shared.ai.PricingModels.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

class PricingModelsTest {

    @Test
    void testDynamicPrice() {
        DynamicPrice price = new DynamicPrice("p1", 100.0);
        price.setFinalPrice(85.0);
        price.setDiscountPercentage(15.0);
        price.setDemandMultiplier(1.2);
        price.setTimeMultiplier(0.9);
        price.setUserSegmentMultiplier(0.95);
        price.setCompetitorPrice(90.0);

        assertEquals("p1", price.getProductId());
        assertEquals(100.0, price.getBasePrice());
        assertEquals(85.0, price.getFinalPrice());
        assertEquals(15.0, price.getDiscountPercentage());
        assertEquals(1.2, price.getDemandMultiplier());
        assertEquals(0.9, price.getTimeMultiplier());
        assertEquals(90.0, price.getCompetitorPrice());
    }

    @Test
    void testPriceTier() {
        PriceTier tier = new PriceTier(2, 5, 95.0, 5.0);
        assertEquals(2, tier.getMinQuantity());
        assertEquals(5, tier.getMaxQuantity());
        assertEquals(95.0, tier.getUnitPrice());
        assertEquals(5.0, tier.getDiscount());
    }

    @Test
    void testPriceSimulation() {
        PriceSimulation sim = new PriceSimulation(100.0, 90.0);
        sim.setExpectedDemandChange(0.25);
        sim.setExpectedRevenueChange(0.12);
        sim.setPriceElasticity(-0.8);
        sim.setConfidence(0.85);
        assertEquals(100.0, sim.getCurrentPrice());
        assertEquals(90.0, sim.getNewPrice());
        assertEquals(0.25, sim.getExpectedDemandChange());
        assertEquals(-0.8, sim.getPriceElasticity());
    }

    @Test
    void testPricingRule() {
        PricingRule rule = new PricingRule("r1", "Festival Discount", "PERCENTAGE");
        rule.setCondition("category == 'electronics'");
        rule.setParameters(Map.of("discount", 20));
        rule.setPriority(1.0);
        rule.setStoreId("s1");
        rule.setProductIds(List.of("p1", "p2"));

        assertEquals("r1", rule.getRuleId());
        assertEquals("Festival Discount", rule.getName());
        assertTrue(rule.isActive());
        assertEquals(1.0, rule.getPriority());
        assertEquals(2, rule.getProductIds().size());
    }

    @Test
    void testPromotionSuggestion() {
        PromotionSuggestion promo = new PromotionSuggestion("BOGO", "p1", 50.0, 15000.0, 0.75);
        promo.setExpectedVolumeImpact(0.3);
        promo.setReason("Clear slow-moving inventory");
        assertEquals("BOGO", promo.getPromotionType());
        assertEquals(50.0, promo.getSuggestedDiscount());
        assertEquals(0.75, promo.getConfidence());
        assertEquals("Clear slow-moving inventory", promo.getReason());
    }
}
