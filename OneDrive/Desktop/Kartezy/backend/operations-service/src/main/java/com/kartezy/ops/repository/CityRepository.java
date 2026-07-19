package com.kartezy.ops.repository;

import com.kartezy.ops.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByName(String name);
    List<City> findByStatus(String status);
    List<City> findByRegion(String region);
    List<City> findByIsActiveTrue();
    long countByStatus(String status);
    
    @Query("SELECT c.region, COUNT(c) FROM City c GROUP BY c.region")
    List<Object[]> countByRegion();
    
    @Query("SELECT c.status, COUNT(c) FROM City c GROUP BY c.status")
    List<Object[]> countByStatus();
}
