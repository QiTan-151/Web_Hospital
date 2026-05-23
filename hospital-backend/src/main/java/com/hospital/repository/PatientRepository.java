// PatientRepository.java
package com.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    List<Patient> findByNameContaining(String name);
    List<Patient> findByCccdContaining(String cccd);
    List<Patient> findByPatientIdContaining(String patientId);
}