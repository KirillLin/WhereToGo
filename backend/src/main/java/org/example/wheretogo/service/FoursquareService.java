package org.example.wheretogo.service;

import org.example.wheretogo.model.Place;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@Service
public class FoursquareService {

    @Value("${foursquare.api.key:demo}")
    private String apiKey;

    @Value("${foursquare.api.url:https://api.foursquare.com/v3/places}")
    private String apiUrl;

    // 10 основных категорий вместо 1500+ (СТАРАЯ ЛОГИКА)
    private final Map<String, String> CATEGORIES = Map.of(
            "13000", "Еда",           // Food
            "13065", "Кофейня",       // Coffee Shop
            "13026", "Ресторан",      // Restaurant
            "13027", "Бар",           // Bar
            "13028", "Паб",           // Pub
            "13039", "Фастфуд",       // Fast Food
            "16000", "Достопримечательность", // Landmarks
            "16032", "Парк",          // Park
            "16037", "Музей",         // Museum
            "16038", "Галерея"        // Art Gallery
    );

    // Улучшенные демо-данные (НОВАЯ ЛОГИКА)
    private final String[] REAL_PLACE_NAMES = {
            "Starbucks", "McDonald's", "KFC", "Burger King", "Subway",
            "Кофейня 'Уют'", "Бар 'Паб'", "Парк Горького", "ТЦ 'Афимолл'",
            "Кинотеатр 'Октябрь'", "Суши-бар", "Пиццерия", "Аптека",
            "Супермаркет", "Книжный магазин", "Спортзал", "Салон красоты",
            "Банк", "Почта", "Цветочный магазин"
    };

    private final String[] STREETS = {
            "Ленина", "Центральная", "Пушкина", "Гагарина", "Советская",
            "Мира", "Тверская", "Арбат", "Невский", "Садовое кольцо"
    };

    private final RestTemplate restTemplate;

    public FoursquareService() {
        this.restTemplate = new RestTemplate();
    }

    // ОСНОВНОЙ МЕТОД - ОБЪЕДИНЯЕТ СТАРУЮ И НОВУЮ ЛОГИКУ
    public List<Place> searchNearby(double lat, double lon, int radius, int limit) {
        // НОВАЯ ЛОГИКА: Если ключ "demo" или пустой - используем улучшенные демо-данные
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("demo")) {
            System.out.println("⚠️ Используются улучшенные демо-данные. Ожидайте одобрения API ключа.");
            return getEnhancedDemoPlaces(lat, lon, limit);
        }

        // СТАРАЯ ЛОГИКА: Используем реальное API
        try {
            return searchNearbyReal(lat, lon, radius, limit);
        } catch (Exception e) {
            System.err.println("❌ Ошибка Foursquare API, переключаемся на демо-данные: " + e.getMessage());
            // НОВАЯ ЛОГИКА: Fallback на улучшенные демо-данные при ошибках API
            return getEnhancedDemoPlaces(lat, lon, limit);
        }
    }

    // СТАРАЯ ЛОГИКА: Реальный вызов Foursquare API
    private List<Place> searchNearbyReal(double lat, double lon, int radius, int limit) {
        String categories = String.join(",", CATEGORIES.keySet());

        String url = UriComponentsBuilder.fromHttpUrl(apiUrl + "/search")
                .queryParam("ll", lat + "," + lon)
                .queryParam("radius", radius)
                .queryParam("limit", Math.min(limit, 50))
                .queryParam("categories", categories)
                .queryParam("fields", "fsq_id,name,categories,location,distance,geocodes,rating,price,hours,tel,website,description,photos")
                .toUriString();

        HttpHeaders headers = createHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return parsePlacesFromResponse(response.getBody());
        }

        throw new RuntimeException("API вернул статус: " + response.getStatusCode());
    }

    // НОВАЯ ЛОГИКА: Улучшенные демо-данные с реальными названиями
    private List<Place> getEnhancedDemoPlaces(double lat, double lon, int limit) {
        Random random = new Random();
        List<Place> places = new ArrayList<>();

        // Создаем более реалистичный набор мест
        for (int i = 0; i < limit; i++) {
            String placeName = REAL_PLACE_NAMES[random.nextInt(REAL_PLACE_NAMES.length)];
            String category = determineCategoryFromName(placeName);
            String street = STREETS[random.nextInt(STREETS.length)];

            Place place = Place.builder()
                    .id("demo_" + System.currentTimeMillis() + "_" + i)
                    .name(placeName)
                    .category(category)
                    .categoryId(getCategoryId(category))
                    .coordinates(
                            lat + (random.nextDouble() - 0.5) * 0.01, // ± ~500m
                            lon + (random.nextDouble() - 0.5) * 0.01
                    )
                    .address("ул. " + street + ", " + (random.nextInt(100) + 1))
                    .location("Москва")
                    .distance(random.nextDouble() * 800 + 200) // 200-1000 метров
                    .rating(3.5 + random.nextDouble() * 1.5) // 3.5-5.0
                    .price(1 + random.nextInt(3)) // 1-3
                    .phone(generatePhoneNumber(random))
                    .website(generateWebsite(placeName))
                    .description(generateDescription(placeName, category))
                    .hours(generateWorkingHours(random))
                    .photoUrl(generatePhotoUrl(placeName))
                    .build();

            places.add(place);
        }

        // Сортируем по расстоянию (ближе -> дальше) как в реальном API
        places.sort(Comparator.comparingDouble(Place::getDistance));

        return places;
    }

    // СТАРАЯ ЛОГИКА: Парсинг ответа от Foursquare API
    private List<Place> parsePlacesFromResponse(Map<String, Object> response) {
        List<Place> places = new ArrayList<>();

        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
        if (results == null) {
            return places;
        }

        for (Map<String, Object> result : results) {
            try {
                Place place = parsePlaceFromResult(result);
                if (place != null) {
                    places.add(place);
                }
            } catch (Exception e) {
                System.err.println("Ошибка при парсинге места: " + e.getMessage());
            }
        }

        return places;
    }

    // СТАРАЯ ЛОГИКА: Парсинг отдельного места из JSON
    private Place parsePlaceFromResult(Map<String, Object> result) {
        Place place = new Place();
        place.setId((String) result.get("fsq_id"));
        place.setName((String) result.get("name"));

        // Обрабатываем категории - используем только наши 10 основных
        List<Map<String, Object>> categories = (List<Map<String, Object>>) result.get("categories");
        if (categories != null && !categories.isEmpty()) {
            String categoryId = (String) categories.get(0).get("id");
            String categoryName = CATEGORIES.getOrDefault(categoryId, "Другое");
            place.setCategory(categoryName);
            place.setCategoryId(categoryId);
        }

        // Локация
        Map<String, Object> location = (Map<String, Object>) result.get("location");
        if (location != null) {
            place.setAddress((String) location.get("formatted_address"));

            // Формируем локацию из города/района
            String locality = (String) location.get("locality");
            String region = (String) location.get("region");
            if (locality != null && region != null) {
                place.setLocation(locality + ", " + region);
            } else if (locality != null) {
                place.setLocation(locality);
            }
        }

        // Координаты
        Map<String, Object> geocodes = (Map<String, Object>) result.get("geocodes");
        if (geocodes != null) {
            Map<String, Object> main = (Map<String, Object>) geocodes.get("main");
            if (main != null) {
                place.setLatitude((Double) main.get("latitude"));
                place.setLongitude((Double) main.get("longitude"));
            }
        }

        // Расстояние
        if (result.containsKey("distance")) {
            place.setDistance(((Number) result.get("distance")).doubleValue());
        }

        // Рейтинг
        if (result.containsKey("rating")) {
            place.setRating(((Number) result.get("rating")).doubleValue());
        }

        // Ценовой диапазон
        if (result.containsKey("price")) {
            place.setPrice((Integer) result.get("price"));
        }

        // Контакты
        if (result.containsKey("tel")) {
            place.setPhone((String) result.get("tel"));
        }

        // Вебсайт
        if (result.containsKey("website")) {
            place.setWebsite((String) result.get("website"));
        }

        // Описание
        if (result.containsKey("description")) {
            place.setDescription((String) result.get("description"));
        }

        // Фото
        List<Map<String, Object>> photos = (List<Map<String, Object>>) result.get("photos");
        if (photos != null && !photos.isEmpty()) {
            String prefix = (String) photos.get(0).get("prefix");
            String suffix = (String) photos.get(0).get("suffix");
            if (prefix != null && suffix != null) {
                place.setPhotoUrl(prefix + "300x300" + suffix);
            }
        }

        return place;
    }

    // СТАРАЯ ЛОГИКА: Получение деталей места
    public Optional<Place> getPlaceDetails(String placeId) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("demo")) {
            // НОВАЯ ЛОГИКА: Для демо-режима возвращаем пустое значение
            return Optional.empty();
        }

        try {
            String url = apiUrl + "/" + placeId + "?fields=fsq_id,name,categories,location,geocodes,rating,price,hours,tel,website,description,photos";

            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return Optional.of(parsePlaceDetails(response.getBody()));
            }

        } catch (Exception e) {
            System.err.println("Ошибка при получении деталей места: " + e.getMessage());
        }

        return Optional.empty();
    }

    // СТАРАЯ ЛОГИКА: Парсинг деталей места
    private Place parsePlaceDetails(Map<String, Object> result) {
        Place place = parsePlaceFromResult(result);

        // Дополнительные детали для отдельного запроса
        Map<String, Object> hours = (Map<String, Object>) result.get("hours");
        if (hours != null && hours.containsKey("display")) {
            place.setHours((String) hours.get("display"));
        }

        return place;
    }

    // СТАРАЯ ЛОГИКА: Создание заголовков с авторизацией
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();

        // НОВАЯ ЛОГИКА: Автоматически определяем тип авторизации
        if (apiKey.startsWith("fsq3")) {
            headers.set("Authorization", "Bearer " + apiKey);
        } else {
            headers.set("Authorization", apiKey);
        }

        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        return headers;
    }

    // СТАРАЯ ЛОГИКА: Получение списка категорий
    public Map<String, String> getAvailableCategories() {
        return new LinkedHashMap<>(CATEGORIES);
    }

    // НОВАЯ ЛОГИКА: Вспомогательные методы для демо-данных

    private String determineCategoryFromName(String placeName) {
        if (placeName.toLowerCase().contains("starbucks") ||
                placeName.toLowerCase().contains("кофейня") ||
                placeName.toLowerCase().contains("кафе")) {
            return "Кофейня";
        } else if (placeName.toLowerCase().contains("mcdonald") ||
                placeName.toLowerCase().contains("kfc") ||
                placeName.toLowerCase().contains("burger") ||
                placeName.toLowerCase().contains("суши") ||
                placeName.toLowerCase().contains("пицц")) {
            return "Ресторан";
        } else if (placeName.toLowerCase().contains("бар") ||
                placeName.toLowerCase().contains("паб")) {
            return "Бар";
        } else if (placeName.toLowerCase().contains("парк")) {
            return "Парк";
        } else if (placeName.toLowerCase().contains("кино")) {
            return "Кинотеатр";
        } else if (placeName.toLowerCase().contains("аптек") ||
                placeName.toLowerCase().contains("магазин") ||
                placeName.toLowerCase().contains("супермаркет")) {
            return "Магазин";
        } else {
            return "Достопримечательность";
        }
    }

    private String getCategoryId(String category) {
        return CATEGORIES.entrySet().stream()
                .filter(entry -> entry.getValue().equals(category))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse("13000");
    }

    private String generatePhoneNumber(Random random) {
        return "+7 " + (900 + random.nextInt(100)) + " " +
                (100 + random.nextInt(900)) + " " +
                (10 + random.nextInt(90));
    }

    private String generateWebsite(String placeName) {
        String baseName = placeName.toLowerCase()
                .replace(" ", "")
                .replace("'", "")
                .replace("«", "")
                .replace("»", "")
                .replace(" ", "");
        return "https://" + baseName + ".ru";
    }

    private String generateDescription(String placeName, String category) {
        Map<String, String> descriptions = Map.of(
                "Кофейня", "Уютное место для кофе и работы",
                "Ресторан", "Вкусная еда и приятная атмосфера",
                "Бар", "Отличное место для вечернего отдыха",
                "Парк", "Прекрасное место для прогулок и отдыха",
                "Магазин", "Широкий ассортимент товаров",
                "Кинотеатр", "Новейшие фильмы в комфортных залах",
                "Достопримечательность", "Интересное место для посещения"
        );
        return descriptions.getOrDefault(category, "Популярное место среди жителей и гостей города");
    }

    private String generateWorkingHours(Random random) {
        String[] hours = {
                "Пн-Вс 9:00-23:00",
                "Пн-Пт 8:00-22:00, Сб-Вс 10:00-20:00",
                "Круглосуточно",
                "Пн-Вс 10:00-21:00",
                "Пн-Сб 9:00-20:00, Вс 10:00-18:00"
        };
        return hours[random.nextInt(hours.length)];
    }

    private String generatePhotoUrl(String placeName) {
        // Заглушки для фото - в реальном API будут настоящие URL
        return null;
    }

    // НОВАЯ ЛОГИКА: Метод для проверки статуса API
    public String getApiStatus() {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("demo")) {
            return "DEMO_MODE";
        } else {
            return "LIVE_MODE";
        }
    }
}