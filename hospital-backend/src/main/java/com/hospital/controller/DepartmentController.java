package com.hospital.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.model.Department;
import com.hospital.model.Room;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.RoomRepository;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<?> getDepartmentRooms(@PathVariable Integer id) {
        if (!departmentRepository.existsById(id)) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Khoa không tồn tại"));
        }
        List<Room> rooms = roomRepository.findByDepartmentId(id);
        return ResponseEntity.ok(rooms);
    }
}
