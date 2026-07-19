package com.kartezy.datawarehouse.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dw_customer_cohorts", indexes = {
    @Index(name = "idx_cohort_date", columnList = "cohortDate"),
    @Index(name = "idx_cohort_type", columnList = "cohortType")
})
public class CustomerCohort {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate cohortDate;

    @Column(nullable = false, length = 20)
    private String cohortType;

    private long cohortSize;
    private double period0;
    private double period1;
    private double period2;
    private double period3;
    private double period4;
    private double period5;
    private double period6;
    private double period7;
    private double period8;
    private double period9;
    private double period10;
    private double period11;
    private double period12;

    private LocalDateTime lastUpdated;

    public CustomerCohort() { this.lastUpdated = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getCohortDate() { return cohortDate; }
    public void setCohortDate(LocalDate cohortDate) { this.cohortDate = cohortDate; }
    public String getCohortType() { return cohortType; }
    public void setCohortType(String cohortType) { this.cohortType = cohortType; }
    public long getCohortSize() { return cohortSize; }
    public void setCohortSize(long cohortSize) { this.cohortSize = cohortSize; }
    public double getRetentionRate(int period) {
        double[] rates = {period0, period1, period2, period3, period4, period5, period6, period7, period8, period9, period10, period11, period12};
        return period >= 0 && period < rates.length ? rates[period] : 0.0;
    }
    public void setRetentionRate(int period, double rate) {
        switch (period) {
            case 0: period0 = rate; break; case 1: period1 = rate; break;
            case 2: period2 = rate; break; case 3: period3 = rate; break;
            case 4: period4 = rate; break; case 5: period5 = rate; break;
            case 6: period6 = rate; break; case 7: period7 = rate; break;
            case 8: period8 = rate; break; case 9: period9 = rate; break;
            case 10: period10 = rate; break; case 11: period11 = rate; break;
            case 12: period12 = rate; break;
        }
    }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
