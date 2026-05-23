package com.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
}
