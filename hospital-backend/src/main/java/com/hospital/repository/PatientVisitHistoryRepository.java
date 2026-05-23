package com.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.model.PatientVisitHistory;

public interface PatientVisitHistoryRepository extends JpaRepository<PatientVisitHistory, Integer> {
    List<PatientVisitHistory> findByPatientCodeOrderByVisitDateDesc(String patientCode);
    List<PatientVisitHistory> findAllByOrderByVisitDateDesc();
}
