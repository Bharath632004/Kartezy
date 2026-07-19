package com.kartezy.shared.ai;

import com.kartezy.shared.ai.RecommendationModels.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

class RecommendationModelsTest {

    @Test
    void testRecommendationRequestCreation() {
        RecommendationRequest request = new RecommendationRequest("user1", "home", 10);
        assertEquals("user1", request.getUserId());
        assertEquals("home", request.getContext());
        assertEquals(10, request.getLimit());
    }

    @Test
    void testRecommendationResultCreation() {
        RecommendationResult result = new RecommendationResult("r1", "PRODUCT", "p1", 0.95, "Because you liked similar items", 0.9);
        assertEquals("r1", result.getId());
        assertEquals("PRODUCT", result.getType());
        assertEquals("p1", result.getItemId());
        assertEquals(0.95, result.getScore());
        assertEquals("Because you liked similar items", result.getReason());
        assertEquals(0.9, result.getConfidence());
    }

    @Test
    void testUserItemMatrix() {
        UserItemMatrix matrix = new UserItemMatrix();
        matrix.addInteraction("user1", "item1", 5.0);
        matrix.addInteraction("user1", "item2", 3.0);
        matrix.addInteraction("user2", "item1", 4.0);

        assertEquals(2, matrix.getAllUsers().size());
        assertTrue(matrix.getItemsForUser("user1").contains("item1"));
        assertTrue(matrix.getItemsForUser("user1").contains("item2"));
        assertEquals(5.0, matrix.getRating("user1", "item1"));
        assertEquals(0.0, matrix.getRating("user1", "item3"));
    }

    @Test
    void testFrequentlyBoughtTogether() {
        FrequentlyBoughtTogether fbt = new FrequentlyBoughtTogether("p1", List.of("p2", "p3"), 0.8, 2.5);
        assertEquals("p1", fbt.getProductId());
        assertEquals(2, fbt.getPairedProductIds().size());
        assertEquals(0.8, fbt.getConfidence());
        assertEquals(2.5, fbt.getLift());
    }

    @Test
    void testTrendingItem() {
        TrendingItem item = new TrendingItem("p1", "PRODUCT", 95.0, 12.5, "24h", 500, 0.35);
        assertEquals("p1", item.getItemId());
        assertEquals("PRODUCT", item.getItemType());
        assertEquals(95.0, item.getTrendScore());
        assertEquals(12.5, item.getVelocity());
        assertEquals(500, item.getInteractionCount());
        assertEquals(0.35, item.getGrowthRate());
    }

    @Test
    void testPersonalizedHomeFeed() {
        HomeSection section1 = new HomeSection("s1", "Recommended For You", "PRODUCT", List.of("p1", "p2"), 1);
        section1.setSubtitle("Based on your preferences");
        List<HomeSection> sections = List.of(section1);
        PersonalizedHomeFeed feed = new PersonalizedHomeFeed("user1", sections);

        assertEquals("user1", feed.getUserId());
        assertEquals(1, feed.getSections().size());
        assertEquals("s1", feed.getSections().get(0).getSectionId());
        assertNotNull(feed.getGeneratedAt());
    }

    @Test
    void testSeasonalRecommendation() {
        SeasonalRecommendation seasonal = new SeasonalRecommendation("summer", List.of("p1", "p2"),
                java.time.Instant.now(), java.time.Instant.now().plusSeconds(86400));
        assertEquals("summer", seasonal.getSeason());
        assertEquals(2, seasonal.getProductIds().size());
        seasonal.setFestival("Diwali");
        assertEquals("Diwali", seasonal.getFestival());
    }

    @Test
    void testProductScore() {
        ProductScore score = new ProductScore("p1", 0.85);
        score.addFeatureScore("popularity", 0.9);
        assertEquals("p1", score.getProductId());
        assertEquals(0.85, score.getScore());
        assertEquals(0.9, score.getFeatureScores().get("popularity"));
    }
}
