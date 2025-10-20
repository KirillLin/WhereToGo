package org.example.wheretogo.controller;

import org.example.wheretogo.model.Place;
import org.example.wheretogo.service.PlacesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "http://localhost:3000")
public class PlacesController {

    @Autowired
    private PlacesService placesService;

    @GetMapping("/nearby")
    public ResponseEntity<List<Place>> getPlacesNearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "1000") int radius) {

        try {
            List<Place> places = placesService.findPlacesNearby(lat, lon, radius);
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/random")
    public ResponseEntity<List<Place>> getRandomPlaces(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5") int count) {

        try {
            List<Place> places = placesService.getRandomPlaces(lat, lon, count);
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Place>> searchPlaces(
            @RequestParam String query,
            @RequestParam double lat,
            @RequestParam double lon) {

        try {
            List<Place> places = placesService.searchPlaces(query, lat, lon);
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Service is running!");
    }
}