package com.kartezy.ops.repository;

import com.kartezy.ops.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findByCityId(Long cityId);
    List<Zone> findByCityIdAndIsActiveTrue(Long cityId);
    List<Zone> findByZoneType(String zoneType);
    List<Zone> findByIsActiveTrue();
    
    @Query("SELECT z.zoneType, COUNT(z) FROM Zone z GROUP BY z.zoneType")
    List<Object[]> countByType();
    
    @Query("SELECT z.city.name, COUNT(z) FROM Zone z GROUP BY z.city.name")
    List<Object[]> countByCity();
}
