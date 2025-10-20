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
    public ResponseEntity<List<Favorite>> getUserFavorites(@PathVariable Long userId) {
        try {
            Optional<User> user = userService.findByEmail("demo@user.com");
            if (user.isPresent()) {
                List<Favorite> favorites = favoritesService.getUserFavorites(user.get());
                return ResponseEntity.ok(favorites);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addToFavorites(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {

        try {
            String placeId = request.get("placeId");
            Optional<User> user = userService.findByEmail("demo@user.com"); // Для демо

            if (user.isPresent()) {
                Place demoPlace = new Place(placeId, "Демо место", "Кафе", 55.7558, 37.6173, "ул. Демо", 100.0);

                Favorite favorite = favoritesService.addToFavorites(user.get(), demoPlace);
                return ResponseEntity.ok(Map.of("message", "Место добавлено в избранное", "favorite", favorite));
            }

            return ResponseEntity.badRequest().body(Map.of("error", "Пользователь не найден"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Ошибка сервера"));
        }
    }

    @DeleteMapping("/{userId}/remove/{placeId}")
    public ResponseEntity<?> removeFromFavorites(
            @PathVariable Long userId,
            @PathVariable String placeId) {

        try {
            Optional<User> user = userService.findByEmail("demo@user.com"); // Для демо

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
            return ResponseEntity.internalServerError().body(Map.of("error", "Ошибка сервера"));
        }
    }
}