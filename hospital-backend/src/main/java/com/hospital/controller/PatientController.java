package com.hospital.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @GetMapping("/next-id")
    public Map<String, String> previewNextPatientId() {
        int next = patientRepository.findAll().stream()
            .mapToInt(Patient::getId)
            .max()
            .orElse(0) + 1;
        return Map.of("patient_id", formatPatientCode(next));
    }

    @PostMapping
    public ResponseEntity<?> addPatient(@RequestBody Patient patient) {
        try {
            if (patient.getName() == null || patient.getName().isBlank()
                    || patient.getCccd() == null || patient.getCccd().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Tên và CCCD là bắt buộc"));
            }

            // Set patientId tạm thời trước khi save
            patient.setPatientId("BN_TEMP");
            
            Patient saved = patientRepository.save(patient);
            
            // Cập nhật với ID thực
            saved.setPatientId(formatPatientCode(saved.getId()));
            saved = patientRepository.save(saved);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Thêm bệnh nhân thành công",
                "id", saved.getId(),
                "patient_id", saved.getPatientId(),
                "patient", saved
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("error", "Lỗi server: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable int id) {
        if (!patientRepository.existsById(id)) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Bệnh nhân không tồn tại"));
        }
        patientRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Xóa bệnh nhân thành công"
        ));
    }

    @GetMapping("/search")
    public List<Patient> searchPatients(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String cccd,
            @RequestParam(required = false) String patientId) {

        String nameQ = trimOrNull(name);
        String cccdQ = trimOrNull(cccd);
        String idQ = trimOrNull(patientId);

        if (nameQ == null && cccdQ == null && idQ == null) {
            return List.of();
        }

        return patientRepository.findAll().stream()
            .filter(p -> nameQ == null
                || (p.getName() != null && p.getName().toLowerCase().contains(nameQ.toLowerCase())))
            .filter(p -> cccdQ == null
                || (p.getCccd() != null && p.getCccd().contains(cccdQ)))
            .filter(p -> idQ == null
                || (p.getPatientId() != null && p.getPatientId().toLowerCase().contains(idQ.toLowerCase())))
            .collect(Collectors.toList());
    }

    private static String formatPatientCode(int id) {
        return "BN" + id;
    }

    private static String trimOrNull(String value) {
        if (value == null) return null;
        String t = value.trim();
        return t.isEmpty() ? null : t;
    }
}
