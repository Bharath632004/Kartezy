package com.kartezy.userservice.repository;

import com.kartezy.userservice.entity.LanguagePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for managing LanguagePreference entities.
 */
@Repository
public interface LanguagePreferenceRepository extends JpaRepository<LanguagePreference, UUID>, JpaSpecificationExecutor<LanguagePreference> {
}