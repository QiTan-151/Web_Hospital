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
import org.springframework.web.bind.annotation.RestController;

import com.hospital.model.Medicine;
import com.hospital.repository.MedicineRepository;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    @Autowired
    private MedicineRepository medicineRepository;

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addMedicine(@RequestBody Medicine medicine) {
        if (medicine.getName() == null || medicine.getQuantity() == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Tên thuốc và số lượng là bắt buộc"));
        }
        Medicine saved = medicineRepository.save(medicine);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Thêm thuốc thành công",
            "id", (int) saved.getId()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable int id, @RequestBody Medicine medicine) {
        if (!medicineRepository.existsById(id)) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Thuốc không tồn tại"));
        }
        medicine.setId(id);
        medicineRepository.save(medicine);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Cập nhật thuốc thành công"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable int id) {
        if (!medicineRepository.existsById(id)) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Thuốc không tồn tại"));
        }
        medicineRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Xóa thuốc thành công"
        ));
    }
}