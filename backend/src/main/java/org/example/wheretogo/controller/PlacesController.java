package org.example.wheretogo.controller;

import org.example.wheretogo.model.Place;
import org.example.wheretogo.service.PlacesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "http://localhost:3000")
public class PlacesController {

    @Autowired
    private PlacesService placesService;

    @GetMapping("/nearby")
    public ResponseEntity<?> getPlacesNearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "1000") int radius) {

        try {
            List<Place> places = placesService.findPlacesNearby(lat, lon, radius);
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Не удалось найти места: " + e.getMessage()));
        }
    }

    @GetMapping("/random")
    public ResponseEntity<?> getRandomPlaces(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5") int count) {

        try {
            List<Place> places = placesService.getRandomPlaces(lat, lon, count);
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Не удалось получить случайные места: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchPlaces(
            @RequestParam String query,
            @RequestParam double lat,
            @RequestParam double lon) {

        try {
            List<Place> places = placesService.searchPlaces(query, lat, lon);
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ошибка поиска: " + e.getMessage()));
        }
    }

    @GetMapping("/category")
    public ResponseEntity<?> getPlacesByCategory(
            @RequestParam String category,
            @RequestParam double lat,
            @RequestParam double lon) {

        try {
            List<Place> places = placesService.getPlacesByCategory(lat, lon, category);
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ошибка фильтрации по категории: " + e.getMessage()));
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getAvailableCategories() {
        try {
            Map<String, String> categories = placesService.getAvailableCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Не удалось получить категории: " + e.getMessage()));
        }
    }

    @GetMapping("/{placeId}")
    public ResponseEntity<?> getPlaceDetails(@PathVariable String placeId) {
        try {
            return placesService.getPlaceDetails(placeId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Не удалось получить детали места: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Service is running! Using real Foursquare API with 10 categories");
    }
}