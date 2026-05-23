package com.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.model.PatientMedicalRecord;

public interface PatientMedicalRecordRepository extends JpaRepository<PatientMedicalRecord, Integer> {
    List<PatientMedicalRecord> findByPatientCodeOrderByExamDateDesc(String patientCode);
    List<PatientMedicalRecord> findAllByOrderByExamDateDesc();
}
