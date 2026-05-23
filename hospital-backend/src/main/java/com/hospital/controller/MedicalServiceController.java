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

import com.hospital.model.MedicalService;
import com.hospital.repository.MedicalServiceRepository;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class MedicalServiceController {

    @Autowired
    private MedicalServiceRepository medicalServiceRepository;

    @GetMapping
    public List<MedicalService> getAllServices() {
        return medicalServiceRepository.findAll();
    }

    @GetMapping("/search")
    public List<MedicalService> searchServices(@RequestParam String query) {
        return medicalServiceRepository
            .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    @PostMapping
    public ResponseEntity<?> addService(@RequestBody MedicalService service) {
        if (service.getName() == null || service.getName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tên dịch vụ là bắt buộc"));
        }
        if (service.getDescription() == null || service.getDescription().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mô tả dịch vụ là bắt buộc"));
        }
        if (service.getPrice() == null || service.getPrice() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Giá tiền phải lớn hơn 0"));
        }
        MedicalService saved = medicalServiceRepository.save(service);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Thêm dịch vụ thành công",
            "id", saved.getId()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Integer id, @RequestBody MedicalService service) {
        if (!medicalServiceRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("error", "Dịch vụ không tồn tại"));
        }
        if (service.getName() == null || service.getName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tên dịch vụ là bắt buộc"));
        }
        service.setId(id);
        medicalServiceRepository.save(service);
        return ResponseEntity.ok(Map.of("success", true, "message", "Cập nhật dịch vụ thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Integer id) {
        if (!medicalServiceRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("error", "Dịch vụ không tồn tại"));
        }
        medicalServiceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Xóa dịch vụ thành công"));
    }
}
