package com.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.model.Bed;

public interface BedRepository extends JpaRepository<Bed, Integer> {
    List<Bed> findByRoomId(Integer roomId);
    long countByRoomId(Integer roomId);
}
