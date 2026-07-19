package com.kartezy.catalogservice.repository;

import com.kartezy.catalogservice.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    List<Brand> findByNameContainingIgnoreCase(String name);
    List<Brand> findByIsActiveTrue();
}
