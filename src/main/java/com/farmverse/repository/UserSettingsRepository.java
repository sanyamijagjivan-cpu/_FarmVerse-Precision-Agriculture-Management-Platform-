package com.farmverse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmverse.entity.User;
import com.farmverse.entity.UserSettings;

public interface UserSettingsRepository
        extends JpaRepository<UserSettings, Long> {

    Optional<UserSettings> findByUser(User user);
}