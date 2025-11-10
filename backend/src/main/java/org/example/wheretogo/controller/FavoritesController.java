package org.example.wheretogo.controller;

import org.example.wheretogo.model.Favorite;
import org.example.wheretogo.model.Place;
import org.example.wheretogo.model.User;
import org.example.wheretogo.service.FavoritesService;
import org.example.wheretogo.service.PlacesService;
import org.example.wheretogo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000")
public class FavoritesController {

    @Autowired
    private FavoritesService favoritesService;

    @Autowired
    private UserService userService;

    @Autowired
    private PlacesService placesService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserFavorites(@PathVariable Long userId) {
        try {
            Optional<User> user = userService.findById(userId); // ИСПРАВЛЕНО: ищем по ID
            if (user.isPresent()) {
                List<Favorite> favorites = favoritesService.getUserFavorites(user.get());
                return ResponseEntity.ok(favorites);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Ошибка получения избранного: " + e.getMessage()));
        }
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addToFavorites(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request) { // ИСПРАВЛЕНО: Object вместо String

        try {
            String placeId = (String) request.get("placeId");
            Map<String, Object> placeData = (Map<String, Object>) request.get("placeData");

            Optional<User> user = userService.findById(userId); // ИСПРАВЛЕНО: ищем по ID

            if (user.isPresent()) {
                // Создаем объект Place из переданных данных
                Place place = createPlaceFromData(placeId, placeData);

                Favorite favorite = favoritesService.addToFavorites(user.get(), place);
                return ResponseEntity.ok(Map.of(
                        "message", "Место добавлено в избранное",
                        "favorite", favorite
                ));
            }

            return ResponseEntity.badRequest().body(Map.of("error", "Пользователь не найден"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Ошибка добавления в избранное: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/remove/{placeId}")
    public ResponseEntity<?> removeFromFavorites(
            @PathVariable Long userId,
            @PathVariable String placeId) {

        try {
            Optional<User> user = userService.findById(userId);

            if (user.isPresent()) {
                boolean removed = favoritesService.removeFromFavorites(user.get(), placeId);
                if (removed) {
                    return ResponseEntity.ok(Map.of("message", "Место удалено из избранного"));
                } else {
                    return ResponseEntity.badRequest().body(Map.of("error", "Место не найдено в избранном"));
                }
            }

            return ResponseEntity.badRequest().body(Map.of("error", "Пользователь не найден"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Ошибка удаления из избранного: " + e.getMessage()));
        }
    }

    @PutMapping("/{favoriteId}/notes")
    public ResponseEntity<?> updateFavoriteNotes(
            @PathVariable Long favoriteId,
            @RequestBody Map<String, String> request) {

        try {
            String notes = request.get("notes");
            Optional<Favorite> updatedFavorite = favoritesService.updateFavoriteNotes(favoriteId, notes);

            if (updatedFavorite.isPresent()) {
                return ResponseEntity.ok(Map.of(
                        "message", "Заметка обновлена",
                        "favorite", updatedFavorite.get()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Ошибка обновления заметки: " + e.getMessage()));
        }
    }

    // Вспомогательный метод для создания Place из данных
    private Place createPlaceFromData(String placeId, Map<String, Object> placeData) {
        if (placeData == null) {
            return new Place(placeId, "Неизвестное место", "Другое", 55.7558, 37.6173, "Адрес не указан", 0.0);
        }

        try {
            // Извлекаем значения
            Double latitude = extractDoubleValue(placeData.get("latitude"), 55.7558);
            Double longitude = extractDoubleValue(placeData.get("longitude"), 37.6173);
            Double distance = extractDoubleValue(placeData.get("distance"), 0.0);
            Double rating = extractDoubleValue(placeData.get("rating"), null);
            Integer price = extractIntegerValue(placeData.get("price"), null);

            // Создаем Builder и используем метод coordinates()
            Place.Builder builder = Place.builder()
                    .id(placeId)
                    .name(extractStringValue(placeData.get("name"), "Неизвестное место"))
                    .category(extractStringValue(placeData.get("category"), "Другое"))
                    .address(extractStringValue(placeData.get("address"), "Адрес не указан"))
                    .coordinates(latitude, longitude) // ИСПРАВЛЕНО: используем метод coordinates()
                    .distance(distance);

            // Опциональные поля добавляем только если они есть
            if (rating != null) {
                builder.rating(rating);
            }
            if (price != null) {
                builder.price(price);
            }

            String phone = extractStringValue(placeData.get("phone"), null);
            if (phone != null) {
                builder.phone(phone);
            }

            String website = extractStringValue(placeData.get("website"), null);
            if (website != null) {
                builder.website(website);
            }

            return builder.build();

        } catch (Exception e) {
            System.err.println("❌ Ошибка создания места: " + e.getMessage());
            e.printStackTrace();
            return new Place(placeId, "Ошибочное место", "Другое", 55.7558, 37.6173, "Ошибка создания", 0.0);
        }
    }

    // Вспомогательные методы для извлечения значений
    private Double extractDoubleValue(Object value, Double defaultValue) {
        if (value == null) return defaultValue;
        try {
            if (value instanceof Number) {
                return ((Number) value).doubleValue();
            } else if (value instanceof String) {
                return Double.parseDouble((String) value);
            }
        } catch (Exception e) {
            System.err.println("Ошибка преобразования в Double: " + value);
        }
        return defaultValue;
    }

    private Integer extractIntegerValue(Object value, Integer defaultValue) {
        if (value == null) return defaultValue;
        try {
            if (value instanceof Number) {
                return ((Number) value).intValue();
            } else if (value instanceof String) {
                return Integer.parseInt((String) value);
            }
        } catch (Exception e) {
            System.err.println("Ошибка преобразования в Integer: " + value);
        }
        return defaultValue;
    }

    private String extractStringValue(Object value, String defaultValue) {
        if (value == null) return defaultValue;
        return value.toString();
    }
}