package com.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.model.MedicalService;

public interface MedicalServiceRepository extends JpaRepository<MedicalService, Integer> {
    List<MedicalService> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description);
}
