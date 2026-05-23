package com.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.model.Room;

public interface RoomRepository extends JpaRepository<Room, Integer> {
    List<Room> findByDepartmentId(Integer departmentId);
    long countByDepartmentId(Integer departmentId);
}
