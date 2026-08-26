package com.farmverse.repository;

import com.farmverse.entity.Notification;
import com.farmverse.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;



public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // =====================================================
    // ALL NOTIFICATIONS
    // =====================================================

    List<Notification>
    findByUserOrderByCreatedAtDesc(User user);

    // =====================================================
    // UNREAD NOTIFICATIONS
    // =====================================================

    List<Notification>
    findByUserAndReadFalseOrderByCreatedAtDesc(User user);

    // =====================================================
    // FIND NOTIFICATION BELONGING TO USER
    // =====================================================

    Optional<Notification>
    findByIdAndUser(Long id, User user);

    // =====================================================
    // COUNT UNREAD
    // =====================================================

    long countByUserAndReadFalse(User user);

    // =====================================================
    // CHECK RECENT DUPLICATE WEATHER ALERT
    // =====================================================

    boolean existsByUserAndTypeAndTitleAndCreatedAtAfter(
            User user,
            String type,
            String title,
            LocalDateTime time
    );

    
}