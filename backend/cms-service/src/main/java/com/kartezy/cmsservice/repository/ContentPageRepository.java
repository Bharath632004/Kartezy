package com.kartezy.cmsservice.repository;

import com.kartezy.cmsservice.entity.ContentPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContentPageRepository extends JpaRepository<ContentPage, UUID> {
    Optional<ContentPage> findBySlug(String slug);
    List<ContentPage> findByActiveTrueAndPublishedTrue();
    List<ContentPage> findByPublishedTrue();
    boolean existsBySlug(String slug);
}
