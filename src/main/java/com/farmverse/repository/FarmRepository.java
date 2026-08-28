package com.farmverse.repository;

import com.farmverse.entity.Farm;
import com.farmverse.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FarmRepository extends JpaRepository<Farm, Long> {

    // Get all farms belonging to a user
    List<Farm> findByUser(User user);

    // Get one farm only if it belongs to the user
    Optional<Farm> findByIdAndUser(Long id, User user);
}