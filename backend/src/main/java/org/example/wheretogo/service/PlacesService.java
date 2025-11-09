package org.example.wheretogo.service;

import org.example.wheretogo.model.Place;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlacesService {

    @Autowired
    private FoursquareService foursquareService;

    public List<Place> findPlacesNearby(double lat, double lon, int radius) {
        return foursquareService.searchNearby(lat, lon, radius, 15);
    }

    public List<Place> getRandomPlaces(double lat, double lon, int count) {
        List<Place> allPlaces = findPlacesNearby(lat, lon, 1000);
        Collections.shuffle(allPlaces);
        return allPlaces.stream()
                .limit(Math.min(count, allPlaces.size()))
                .collect(Collectors.toList());
    }

    public List<Place> searchPlaces(String query, double lat, double lon) {
        List<Place> allPlaces = findPlacesNearby(lat, lon, 2000);
        return allPlaces.stream()
                .filter(place ->
                        place.getName().toLowerCase().contains(query.toLowerCase()) ||
                                (place.getCategory() != null &&
                                        place.getCategory().toLowerCase().contains(query.toLowerCase())) ||
                                (place.getDescription() != null &&
                                        place.getDescription().toLowerCase().contains(query.toLowerCase()))
                )
                .collect(Collectors.toList());
    }

    public List<Place> getPlacesByCategory(double lat, double lon, String category) {
        List<Place> allPlaces = findPlacesNearby(lat, lon, 1000);
        return allPlaces.stream()
                .filter(place -> place.getCategory() != null &&
                        place.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public Optional<Place> getPlaceDetails(String placeId) {
        return foursquareService.getPlaceDetails(placeId);
    }

    public Map<String, String> getAvailableCategories() {
        return foursquareService.getAvailableCategories();
    }
}