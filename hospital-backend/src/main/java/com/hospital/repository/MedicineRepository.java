// MedicineRepository.java
package com.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.model.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Integer> {}