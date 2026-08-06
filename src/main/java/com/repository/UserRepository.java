package com.farmverse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmverse.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}