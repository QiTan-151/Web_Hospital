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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.model.PatientVisitHistory;
import com.hospital.repository.PatientVisitHistoryRepository;

@RestController
@RequestMapping("/api/visit-history")
@CrossOrigin(origins = "*")
public class PatientVisitHistoryController {

    @Autowired
    private PatientVisitHistoryRepository visitRepository;

    @GetMapping
    public List<PatientVisitHistory> getAll(
            @RequestParam(required = false) String patientId) {
        if (patientId != null && !patientId.isBlank()) {
            return visitRepository.findByPatientCodeOrderByVisitDateDesc(patientId.trim());
        }
        return visitRepository.findAllByOrderByVisitDateDesc();
    }

    @PostMapping
    public ResponseEntity<?> addVisit(@RequestBody PatientVisitHistory visit) {
        if (visit.getPatientCode() == null || visit.getPatientCode().isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Mã bệnh nhân là bắt buộc"));
        }
        PatientVisitHistory saved = visitRepository.save(visit);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Thêm lịch sử khám thành công",
            "visit", saved
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVisit(@PathVariable int id) {
        if (!visitRepository.existsById(id)) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Không tìm thấy lịch sử khám"));
        }
        visitRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Đã xóa lịch sử khám"
        ));
    }
}
