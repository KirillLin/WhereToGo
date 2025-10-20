package org.example.wheretogo.service;

import org.example.wheretogo.model.Place;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class PlacesService {

    @Value("${foursquare.api.key:demo}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public PlacesService() {
        this.restTemplate = new RestTemplate();
    }

    public List<Place> findPlacesNearby(double lat, double lon, int radius) {
        try {
            // Для демо-режима возвращаем тестовые данные
            return getDemoPlaces(lat, lon);

        } catch (Exception e) {
            System.out.println("Ошибка при поиске мест: " + e.getMessage());
            return getDemoPlaces(lat, lon);
        }
    }

    public List<Place> getRandomPlaces(double lat, double lon, int count) {
        List<Place> allPlaces = findPlacesNearby(lat, lon, 1000);
        Collections.shuffle(allPlaces);
        return allPlaces.stream().limit(count).toList();
    }

    public List<Place> searchPlaces(String query, double lat, double lon) {
        List<Place> allPlaces = findPlacesNearby(lat, lon, 2000);
        return allPlaces.stream()
                .filter(place -> place.getName().toLowerCase().contains(query.toLowerCase()))
                .toList();
    }

    private List<Place> getDemoPlaces(double lat, double lon) {
        Random random = new Random();
        String[] categories = {"Кафе", "Ресторан", "Парк", "Магазин", "Бар", "Музей", "Кинотеатр"};
        String[] streets = {"Центральная", "Ленина", "Пушкина", "Гагарина", "Советская", "Мира"};

        List<Place> places = new ArrayList<>();

        for (int i = 1; i <= 10; i++) {
            String category = categories[random.nextInt(categories.length)];
            String street = streets[random.nextInt(streets.length)];

            Place place = new Place(
                    "demo_" + i,
                    generatePlaceName(category, i),
                    category,
                    lat + (random.nextDouble() - 0.5) * 0.02, // ± ~1km
                    lon + (random.nextDouble() - 0.5) * 0.02,
                    "ул. " + street + ", " + (random.nextInt(100) + 1),
                    random.nextDouble() * 1000
            );

            // Добавляем рейтинг для некоторых мест
            if (random.nextBoolean()) {
                place.setRating(3 + random.nextDouble() * 2); // Рейтинг 3-5
            }

            places.add(place);
        }

        return places;
    }

    private String generatePlaceName(String category, int index) {
        String[] prefixes = {"Уютный", "Современный", "Старинный", "Семейный", "Премиум"};
        String[] suffixes = {"у реки", "в центре", "на площади", "у метро", ""};

        Random random = new Random();
        String prefix = prefixes[random.nextInt(prefixes.length)];
        String suffix = suffixes[random.nextInt(suffixes.length)];

        return prefix + " " + category + " " + suffix + " " + index;
    }
}