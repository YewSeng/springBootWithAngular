package com.caltech.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.caltech.pojo.User;

@Repository
public interface UserRepository extends JpaRepository<User,UUID> {

	Optional<User> findByUsername(String username);
}
