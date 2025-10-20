package org.example.wheretogo.service;

import org.example.wheretogo.model.Place;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class FoursquareService {

    @Value("${foursquare.api.key:demo}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public FoursquareService() {
        this.restTemplate = new RestTemplate();
    }

    public List<Place> findPlacesNearby(double lat, double lon, int radius) {
        // Если используется демо-ключ, возвращаем тестовые данные
        if ("demo".equals(apiKey) || apiKey == null || apiKey.isEmpty()) {
            return getDemoPlaces(lat, lon);
        }

        try {
            String url = String.format(
                    "https://api.foursquare.com/v3/places/search?ll=%s,%s&radius=%d&limit=20&categories=13000,13009,16000,18000",
                    lat, lon, radius
            );

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiKey);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return parsePlacesFromResponse(response.getBody());
            } else {
                System.out.println("Foursquare API returned: " + response.getStatusCode());
                return getDemoPlaces(lat, lon);
            }

        } catch (Exception e) {
            System.out.println("Foursquare API error: " + e.getMessage());
            return getDemoPlaces(lat, lon);
        }
    }

    public List<Place> getRandomPlaces(double lat, double lon, int count) {
        List<Place> allPlaces = findPlacesNearby(lat, lon, 1000);
        Collections.shuffle(allPlaces);
        return allPlaces.stream().limit(count).toList();
    }

    public List<Place> searchPlaces(String query, double lat, double lon) {
        if ("demo".equals(apiKey) || apiKey == null || apiKey.isEmpty()) {
            List<Place> allPlaces = getDemoPlaces(lat, lon);
            return allPlaces.stream()
                    .filter(place -> place.getName().toLowerCase().contains(query.toLowerCase()))
                    .toList();
        }

        try {
            String url = String.format(
                    "https://api.foursquare.com/v3/places/search?query=%s&ll=%s,%s&radius=2000&limit=10",
                    query, lat, lon
            );

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiKey);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return parsePlacesFromResponse(response.getBody());
            } else {
                return getDemoPlaces(lat, lon);
            }

        } catch (Exception e) {
            System.out.println("Foursquare search error: " + e.getMessage());
            return getDemoPlaces(lat, lon);
        }
    }

    private List<Place> parsePlacesFromResponse(Map<String, Object> response) {
        List<Place> places = new ArrayList<>();

        try {
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");

            if (results == null) {
                System.out.println("No results in Foursquare response");
                return places;
            }

            for (Map<String, Object> result : results) {
