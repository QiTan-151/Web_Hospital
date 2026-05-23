package com.hospital.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.model.Employee;
import com.hospital.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addEmployee(@RequestBody Employee employee) {
        if (employee.getName() == null || employee.getName().isBlank()
                || employee.getCccd() == null || employee.getCccd().isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Tên và CCCD là bắt buộc"));
        }
        if (employeeRepository.existsByCccd(employee.getCccd())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "CCCD đã tồn tại trong hệ thống"));
        }
        Employee saved = employeeRepository.save(employee);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Thêm nhân viên thành công",
            "id", (int) saved.getId()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable int id, @RequestBody Employee employee) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Nhân viên không tồn tại"));
        }
        employee.setId(id);
        employeeRepository.save(employee);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Cập nhật nhân viên thành công"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable int id) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Nhân viên không tồn tại"));
        }
        employeeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Xóa nhân viên thành công"
        ));
    }

    @GetMapping("/search")
    public List<Employee> searchEmployees(@RequestParam String query) {
        return employeeRepository.findByNameContainingOrCccdContaining(query, query);
    }
}