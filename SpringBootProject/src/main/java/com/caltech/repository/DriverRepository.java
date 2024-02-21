package com.caltech.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.caltech.pojo.Driver;

@Repository
public interface DriverRepository extends JpaRepository<Driver,UUID> {

	Optional<Driver> findByUsername(String username);

}
