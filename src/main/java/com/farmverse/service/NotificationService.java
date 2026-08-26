package com.farmverse.service;

import com.farmverse.dto.NotificationResponse;
import com.farmverse.dto.WeatherResponse;
import com.farmverse.entity.Notification;
import com.farmverse.entity.User;
import com.farmverse.entity.UserSettings;
import com.farmverse.repository.NotificationRepository;
import com.farmverse.repository.UserRepository;
import com.farmverse.repository.UserSettingsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSettingsRepository settingsRepository;

    // =====================================================
    // GET ALL NOTIFICATIONS
    // =====================================================

    public List<NotificationResponse> getNotifications(
            String email) {

        User user = getUser(email);

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    public long getUnreadCount(String email) {

        User user = getUser(email);

        return notificationRepository
                .countByUserAndReadFalse(user);
    }

    // =====================================================
    // MARK ONE AS READ
    // =====================================================

    public NotificationResponse markAsRead(
            String email,
            Long notificationId) {

        User user = getUser(email);

        Notification notification =
                notificationRepository
                        .findByIdAndUser(
                                notificationId,
                                user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"));

        notification.setRead(true);

        Notification saved =
                notificationRepository.save(notification);

        return convertToResponse(saved);
    }

    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    public void markAllAsRead(String email) {

        User user = getUser(email);

        List<Notification> notifications =
                notificationRepository
                        .findByUserAndReadFalseOrderByCreatedAtDesc(
                                user);

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }

    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    public void deleteNotification(
            String email,
            Long notificationId) {

        User user = getUser(email);

        Notification notification =
                notificationRepository
                        .findByIdAndUser(
                                notificationId,
                                user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"));

        notificationRepository.delete(notification);
    }

    // =====================================================
    // CREATE NORMAL NOTIFICATION
    // =====================================================

    public NotificationResponse createNotification(
            String email,
            String title,
            String message,
            String type) {

        User user = getUser(email);

        UserSettings settings =
                settingsRepository
                        .findByUser(user)
                        .orElse(null);

        if (!isNotificationAllowed(settings, type)) {
            return null;
        }

        Notification notification =
                new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        Notification saved =
                notificationRepository.save(notification);

        return convertToResponse(saved);
    }

    // =====================================================
    // AUTOMATIC WEATHER NOTIFICATIONS
    // =====================================================

    public void createWeatherNotifications(
            String email,
            WeatherResponse weather) {

        if (weather == null ||
                weather.getRisks() == null) {

            return;
        }

        User user = getUser(email);

        // =================================================
        // CHECK SETTINGS
        // =================================================

        UserSettings settings =
                settingsRepository
                        .findByUser(user)
                        .orElse(null);

        if (settings != null) {

            if (!settings.isNotificationsEnabled()) {
                return;
            }

            if (!settings.isWeatherAlerts()) {
                return;
            }
        }

        // =================================================
        // CHECK EACH WEATHER RISK
        // =================================================

        for (WeatherResponse.WeatherRisk risk
                : weather.getRisks()) {

            if (risk == null) {
                continue;
            }

            /*
             * Only generate an automatic notification
             * when the risk is High.
             */

            if (!"High".equalsIgnoreCase(
                    risk.getLevel())) {

                continue;
            }

            String title;

            String message;

            // =============================================
            // HEAT
            // =============================================

            if ("Heat Stress".equalsIgnoreCase(
                    risk.getName())) {

                title =
                        "High Heat Stress Alert";

                message =
                        "High heat stress risk detected "
                        + "in "
                        + weather.getLocation()
                        + ". Current temperature is "
                        + String.format(
                                "%.1f",
                                weather.getTemperature())
                        + "°C. Consider protecting crops "
                        + "from excessive heat.";

            }

            // =============================================
            // RAIN
            // =============================================

            else if ("Rain Risk".equalsIgnoreCase(
                    risk.getName())) {

                title =
                        "Heavy Rain Risk Alert";

                message =
                        "High rain risk detected in "
                        + weather.getLocation()
                        + ". Rain probability is elevated "
                        + "over the upcoming forecast period. "
                        + "Plan irrigation and field activities "
                        + "accordingly.";

            }

            // =============================================
            // WIND
            // =============================================

            else if ("Wind Risk".equalsIgnoreCase(
                    risk.getName())) {

                title =
                        "Strong Wind Alert";

                message =
                        "Strong wind conditions are possible "
                        + "in "
                        + weather.getLocation()
                        + ". Current wind speed is "
                        + String.format(
                                "%.1f",
                                weather.getWindSpeed())
                        + " km/h. Protect vulnerable crops "
                        + "and structures.";

            }

            // =============================================
            // HUMIDITY
            // =============================================

            else if ("Humidity Risk".equalsIgnoreCase(
                    risk.getName())) {

                title =
                        "High Humidity Alert";

                message =
                        "High humidity conditions detected "
                        + "in "
                        + weather.getLocation()
                        + ". Current humidity is "
                        + weather.getHumidity()
                        + "%. Monitor crops for possible "
                        + "fungal disease development.";

            }

            else {
                continue;
            }

            // =============================================
            // PREVENT DUPLICATE ALERTS
            // =============================================

            LocalDateTime oneHourAgo =
                    LocalDateTime.now()
                            .minusHours(1);

            boolean alreadyExists =
                    notificationRepository
                            .existsByUserAndTypeAndTitleAndCreatedAtAfter(
                                    user,
                                    "WEATHER",
                                    title,
                                    oneHourAgo
                            );

            if (alreadyExists) {
                continue;
            }

            // =============================================
            // SAVE NOTIFICATION
            // =============================================

            Notification notification =
                    new Notification();

            notification.setUser(user);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType("WEATHER");
            notification.setRead(false);
            notification.setCreatedAt(
                    LocalDateTime.now());

            notificationRepository.save(
                    notification);

            System.out.println(
                    "WEATHER NOTIFICATION CREATED: "
                    + title);
        }
    }

    // =====================================================
    // CHECK NOTIFICATION PREFERENCE
    // =====================================================

    private boolean isNotificationAllowed(
            UserSettings settings,
            String type) {

        if (settings == null) {
            return true;
        }

        if (!settings.isNotificationsEnabled()) {
            return false;
        }

        switch (type.toUpperCase()) {

            case "WEATHER":
                return settings.isWeatherAlerts();

            case "CROP":
                return settings.isCropAlerts();

            case "MARKET":
                return settings.isMarketAlerts();

            case "SYSTEM":
                return settings.isSystemUpdates();

            default:
                return true;
        }
    }

    // =====================================================
    // GET USER
    // =====================================================

    private User getUser(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));
    }

    // =====================================================
    // CONVERT ENTITY → RESPONSE
    // =====================================================

    private NotificationResponse convertToResponse(
            Notification notification) {

        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}