package com.kartezy.shared.audit;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.time.Instant;

/**
 * Auditable entity that extends BaseEntity with audit fields.
 * Tracks who created and last modified the entity, and when.
 */
@MappedSuperclass
public abstract class AuditableEntity extends BaseEntity {

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Column(name = "created_at_dt")
    private Long createdAtDt;

    @Column(name = "updated_at_dt")
    private Long updatedAtDt;

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Long getCreatedAtDt() {
        return createdAtDt;
    }

    public void setCreatedAtDt(Long createdAtDt) {
        this.createdAtDt = createdAtDt;
    }

    public Long getUpdatedAtDt() {
        return updatedAtDt;
    }

    public void setUpdatedAtDt(Long updatedAtDt) {
        this.updatedAtDt = updatedAtDt;
    }
}