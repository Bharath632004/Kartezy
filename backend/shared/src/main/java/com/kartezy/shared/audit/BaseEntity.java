package com.kartezy.shared.audit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.time.Instant;
/**
 * Base entity with common fields for all entities.
 * Includes ID, creation timestamp, update timestamp, and soft delete flag.
 */
@MappedSuperclass
public abstract class BaseEntity {
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, updatable = false)
    private Long id = 0L; // Will be set by @GeneratedValue on persist
    @Column(name = "created_at", nullable = false, updatable = false)
    private long createdAt = Instant.now().toEpochMilli();
    @Column(name = "updated_at", nullable = false)
    private long updatedAt = Instant.now().toEpochMilli();
    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public long getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }
    public long getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(long updatedAt) {
        this.updatedAt = updatedAt;
    }
    public boolean isDeleted() {
        return deleted;
    }
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
    @PrePersist
    protected void onCreate() {
        long now = Instant.now().toEpochMilli();
        this.createdAt = now;
        this.updatedAt = now;
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now().toEpochMilli();
    }
}
