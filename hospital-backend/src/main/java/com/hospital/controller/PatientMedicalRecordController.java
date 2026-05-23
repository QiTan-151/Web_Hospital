package com.hospital.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.model.PatientMedicalRecord;
import com.hospital.repository.PatientMedicalRecordRepository;

@RestController
@RequestMapping("/api/patient-records")
@CrossOrigin(origins = "*")
public class PatientMedicalRecordController {

    @Autowired
    private PatientMedicalRecordRepository recordRepository;

    @GetMapping
    public List<PatientMedicalRecord> getAll(
            @RequestParam(required = false) String patientId) {
        if (patientId != null && !patientId.isBlank()) {
            return recordRepository.findByPatientCodeOrderByExamDateDesc(patientId.trim());
        }
        return recordRepository.findAllByOrderByExamDateDesc();
    }

    @PostMapping
    public ResponseEntity<?> addRecord(@RequestBody PatientMedicalRecord record) {
        if (record.getPatientCode() == null || record.getPatientCode().isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Mã bệnh nhân là bắt buộc"));
        }
        if (record.getRecordType() == null || record.getRecordType().isBlank()) {
            record.setRecordType("MANUAL");
        }
        PatientMedicalRecord saved = recordRepository.save(record);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Lưu hồ sơ bệnh án thành công",
            "record", saved
        ));
    }
}
