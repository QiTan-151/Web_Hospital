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

import com.hospital.model.Bed;
import com.hospital.model.Room;
import com.hospital.repository.BedRepository;
import com.hospital.repository.RoomRepository;

@RestController
@CrossOrigin(origins = "*")
public class BedController {

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/api/rooms/{roomId}/beds")
    public ResponseEntity<?> getRoomBeds(@PathVariable Integer roomId) {
        if (!roomRepository.existsById(roomId)) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Phòng không tồn tại"));
        }
        return ResponseEntity.ok(bedRepository.findByRoomId(roomId));
    }

    @PostMapping("/api/rooms/{roomId}/beds")
    public ResponseEntity<?> addBed(@PathVariable Integer roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if (room == null) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Phòng không tồn tại"));
        }

        long count = bedRepository.countByRoomId(roomId);
        Bed bed = new Bed();
        bed.setRoom(room);
        bed.setBedNumber("Giường " + (count + 1));
        bed.setStatus("available");

        Bed saved = bedRepository.save(bed);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Thêm giường thành công",
            "id", saved.getId(),
            "bed_number", saved.getBedNumber(),
            "status", saved.getStatus()
        ));
    }

    @DeleteMapping("/api/beds/{bedId}")
    public ResponseEntity<?> deleteBed(@PathVariable Integer bedId) {
        if (!bedRepository.existsById(bedId)) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Giường không tồn tại"));
        }
        bedRepository.deleteById(bedId);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Xóa giường thành công"
        ));
    }

    @PutMapping("/api/beds/{bedId}/status")
    public ResponseEntity<?> updateBedStatus(
            @PathVariable Integer bedId,
            @RequestBody Map<String, String> body) {
        Bed bed = bedRepository.findById(bedId).orElse(null);
        if (bed == null) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Giường không tồn tại"));
        }

        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Trạng thái không hợp lệ"));
        }

        bed.setStatus(status);
        if ("occupied".equals(status)) {
            String patientId = body.get("patient_id");
            if (patientId == null || patientId.isBlank()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Vui lòng nhập mã bệnh nhân"));
            }
            bed.setPatientId(patientId);
        } else {
            bed.setPatientId(null);
        }

        bedRepository.save(bed);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Cập nhật trạng thái thành công"
        ));
    }
}
