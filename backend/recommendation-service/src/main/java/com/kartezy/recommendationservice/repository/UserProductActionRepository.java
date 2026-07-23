package com.kartezy.recommendationservice.repository;

import com.kartezy.recommendationservice.entity.UserProductAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface UserProductActionRepository extends JpaRepository<UserProductAction, UUID> {
    List<UserProductAction> findByUserIdAndActionTypeOrderByCreatedAtDesc(UUID userId, String actionType);

    @Query("SELECT DISTINCT a.productId FROM UserProductAction a WHERE a.userId = :userId ORDER BY a.createdAt DESC")
    List<UUID> findDistinctProductIdsByUserId(@Param("userId") UUID userId);

    @Query("SELECT a.productId, COUNT(a) as cnt FROM UserProductAction a GROUP BY a.productId ORDER BY cnt DESC")
    List<Object[]> findPopularProductIds();
}
