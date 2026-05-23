// EmployeeRepository.java
package com.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    List<Employee> findByNameContainingOrCccdContaining(String name, String cccd);
    boolean existsByCccd(String cccd);
}