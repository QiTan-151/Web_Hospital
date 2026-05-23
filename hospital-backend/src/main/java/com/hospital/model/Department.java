package com.hospital.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(name = "doctor_count")
    @JsonProperty("doctor_count")
    private Integer doctorCount;

    @Column(name = "nurse_count")
    @JsonProperty("nurse_count")
    private Integer nurseCount;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getDoctorCount() { return doctorCount; }
    public void setDoctorCount(Integer doctorCount) { this.doctorCount = doctorCount; }

    public Integer getNurseCount() { return nurseCount; }
    public void setNurseCount(Integer nurseCount) { this.nurseCount = nurseCount; }
}
