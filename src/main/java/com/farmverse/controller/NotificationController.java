package com.farmverse.controller;

import com.farmverse.dto.NotificationResponse;
import com.farmverse.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // =====================================================
    // GET ALL NOTIFICATIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                notificationService.getNotifications(email)
        );
    }

    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                notificationService.getUnreadCount(email)
        );
    }

    // =====================================================
    // MARK ONE AS READ
    // =====================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                notificationService.markAsRead(
                        email,
                        id
                )
        );
    }

    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead(
            Authentication authentication) {

        String email = authentication.getName();

        notificationService.markAllAsRead(email);

        return ResponseEntity.ok(
                "All notifications marked as read"
        );
    }

    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        notificationService.deleteNotification(
                email,
                id
        );

        return ResponseEntity.ok(
                "Notification deleted successfully"
        );
    }

    // =====================================================
// CREATE TEST NOTIFICATION
// =====================================================

@PostMapping("/test")
public ResponseEntity<NotificationResponse> createTestNotification(
        Authentication authentication) {

    String email = authentication.getName();

    NotificationResponse notification =
            notificationService.createNotification(
                    email,
                    "Weather Alert",
                    "Rain is expected in your farming area today.",
                    "WEATHER"
            );

    if (notification == null) {
        return ResponseEntity.badRequest().build();
    }

    return ResponseEntity.ok(notification);
}
}