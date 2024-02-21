package com.caltech.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.caltech.pojo.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking,UUID> {

	String findByUserId = "SELECT b FROM Booking b WHERE b.user.id = :userId";
	String findByDriverId = "SELECT b FROM Booking b WHERE b.driver.id = :driverId";
	
	@Query(value = findByUserId)
    List<Booking> findByUserId(UUID userId);

	@Query(value = findByDriverId)
	List<Booking> findByDriverId(UUID driverId);
}
