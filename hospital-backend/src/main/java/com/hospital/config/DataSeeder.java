package com.hospital.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.hospital.model.Bed;
import com.hospital.model.Department;
import com.hospital.model.MedicalService;
import com.hospital.model.Room;
import com.hospital.repository.BedRepository;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.MedicalServiceRepository;
import com.hospital.repository.RoomRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDepartments(
            DepartmentRepository departmentRepository,
            RoomRepository roomRepository,
            BedRepository bedRepository) {
        return args -> {
            if (departmentRepository.count() > 0) {
                return;
            }

            seedDepartment(departmentRepository, roomRepository, bedRepository,
                "Khoa cấp cứu", 10, 20,
                new String[]{
                    "Phòng cấp cứu 1", "Phòng cấp cứu 2",
                    "Phòng cấp cứu 3", "Phòng cấp cứu 4"
                });

            seedDepartment(departmentRepository, roomRepository, bedRepository,
                "Khoa hồi sức", 10, 20,
                new String[]{
                    "Phòng Hồi sức cấp cứu", "Phòng Hồi sức tích cực",
                    "Phòng Hồi sức sau phẫu thuật", "Phòng Hồi sức nội khoa"
                });

            seedDepartment(departmentRepository, roomRepository, bedRepository,
                "Khoa chấn thương chỉnh hình", 8, 15,
                new String[]{
                    "Phòng Cấp cứu Chấn thương", "Phòng Phẫu thuật",
                    "Phòng Hậu phẫu", "Phòng Phục hồi chức năng"
                });

            seedDepartment(departmentRepository, roomRepository, bedRepository,
                "Khoa nội thần kinh", 9, 18,
                new String[]{
                    "Phòng Khám Nội Thần Kinh", "Phòng Điều Trị Nội Thần Kinh",
                    "Phòng Chăm Sóc Bệnh Nhân Đột Quỵ", "Phòng Điện Não - Chẩn Đoán Hình Ảnh Thần Kinh"
                });

            seedDepartment(departmentRepository, roomRepository, bedRepository,
                "Khoa ngoại thần kinh", 7, 14,
                new String[]{
                    "Phòng Hậu phẫu Ngoại Thần Kinh", "Phòng Điều trị Ngoại Thần Kinh",
                    "Phòng Hồi sức Ngoại Thần Kinh", "Phòng Chăm sóc đặc biệt Ngoại Thần Kinh"
                });

            seedDepartment(departmentRepository, roomRepository, bedRepository,
                "Khoa hô hấp", 8, 16,
                new String[]{
                    "Phòng Nội soi Hô hấp", "Phòng Thăm dò Chức năng Hô hấp",
                    "Phòng Điều trị Bệnh Phổi Mạn tính", "Phòng Cách ly Lao và Nhiễm Khuẩn Hô hấp"
                });
        };
    }

    @Bean
    CommandLineRunner seedMedicalServices(MedicalServiceRepository medicalServiceRepository) {
        return args -> {
            if (medicalServiceRepository.count() > 0) {
                return;
            }
            seedService(medicalServiceRepository, "Khám tổng quát",
                "Khám sức khỏe định kỳ, đo huyết áp, chỉ số cơ bản", 350000L);
            seedService(medicalServiceRepository, "Xét nghiệm máu",
                "Công thức máu, sinh hóa máu cơ bản", 450000L);
            seedService(medicalServiceRepository, "Siêu âm bụng",
                "Siêu âm ổ bụng tổng quát", 550000L);
            seedService(medicalServiceRepository, "Chụp X-quang",
                "Chụp X-quang theo chỉ định bác sĩ", 300000L);
            seedService(medicalServiceRepository, "Tiêm chủng",
                "Tiêm vaccine theo lịch hẹn", 250000L);
        };
    }

    private void seedService(MedicalServiceRepository repo, String name, String desc, long price) {
        MedicalService s = new MedicalService();
        s.setName(name);
        s.setDescription(desc);
        s.setPrice(price);
        repo.save(s);
    }

    private void seedDepartment(
            DepartmentRepository departmentRepository,
            RoomRepository roomRepository,
            BedRepository bedRepository,
            String name, int doctors, int nurses, String[] roomNames) {
        Department dept = new Department();
        dept.setName(name);
        dept.setDoctorCount(doctors);
        dept.setNurseCount(nurses);
        dept = departmentRepository.save(dept);

        for (String roomName : roomNames) {
            Room room = new Room();
            room.setName(roomName);
            room.setDepartment(dept);
            room = roomRepository.save(room);

            for (int i = 1; i <= 4; i++) {
                Bed bed = new Bed();
                bed.setRoom(room);
                bed.setBedNumber("Giường " + i);
                bed.setStatus("available");
                bedRepository.save(bed);
            }
        }
    }
}
