package com.kartezy.ops.repository;

import com.kartezy.ops.entity.OpsDashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OpsDashboardRepository extends JpaRepository<OpsDashboard, Long> {
    Optional<OpsDashboard> findTopByCityIdOrderBySnapshotDateDesc(Long cityId);
    List<OpsDashboard> findByCityIdAndSnapshotDateBetween(Long cityId, LocalDateTime from, LocalDateTime to);
    List<OpsDashboard> findBySnapshotDateBetween(LocalDateTime from, LocalDateTime to);
    
    @Query("SELECT COALESCE(SUM(d.openTickets), 0), COALESCE(SUM(d.criticalTickets), 0), " +
           "COALESCE(SUM(d.slaBreaches), 0), COALESCE(SUM(d.activeDeliveries), 0), " +
           "COALESCE(SUM(d.pendingVerifications), 0), COALESCE(SUM(d.outOfStockItems), 0) " +
           "FROM OpsDashboard d WHERE d.snapshotDate = (SELECT MAX(d2.snapshotDate) FROM OpsDashboard d2)")
    List<Object[]> getLatestAggregatedMetrics();
}
