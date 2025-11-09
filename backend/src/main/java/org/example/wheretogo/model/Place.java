package org.example.wheretogo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "places")
public class Place {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String category;
    private String categoryId;
    private Double latitude;
    private Double longitude;
    private String address;
    private String location;
    private Double distance;
    private Double rating;
    private Integer price;
    private String phone;
    private String website;

    @Column(length = 1000)
    private String description;

    private String hours;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    public Place() {}

    public Place(String id, String name, String category, Double latitude,
                 Double longitude, String address, Double distance) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.distance = distance;
    }

    // Полный конструктор для удобства
    public Place(String id, String name, String category, String categoryId,
                 Double latitude, Double longitude, String address, String location,
                 Double distance, Double rating, Integer price, String phone,
                 String website, String description, String hours, String photoUrl) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.categoryId = categoryId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.location = location;
        this.distance = distance;
        this.rating = rating;
        this.price = price;
        this.phone = phone;
        this.website = website;
        this.description = description;
        this.hours = hours;
        this.photoUrl = photoUrl;
    }

    // Геттеры и сеттеры
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getHours() { return hours; }
    public void setHours(String hours) { this.hours = hours; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    // Вспомогательные методы
    public boolean hasRating() {
        return rating != null && rating > 0;
    }

    public boolean hasPrice() {
        return price != null && price > 0;
    }

    public boolean hasPhoto() {
        return photoUrl != null && !photoUrl.isEmpty();
    }

    public boolean hasContactInfo() {
        return (phone != null && !phone.isEmpty()) || (website != null && !website.isEmpty());
    }

    public String getFormattedDistance() {
        if (distance == null) return "Неизвестно";
        if (distance < 1000) {
            return Math.round(distance) + " м";
        } else {
            return String.format("%.1f км", distance / 1000);
        }
    }

    public String getPriceLevel() {
        if (price == null) return "Неизвестно";
        switch (price) {
            case 1: return "💰";
            case 2: return "💰💰";
            case 3: return "💰💰💰";
            case 4: return "💰💰💰💰";
            default: return "💸";
        }
    }

    @Override
    public String toString() {
        return "Place{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", distance=" + distance +
                ", rating=" + rating +
                ", address='" + address + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Place place = (Place) o;
        return id.equals(place.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    // Builder pattern для удобного создания объектов
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private String category;
        private String categoryId;
        private Double latitude;
        private Double longitude;
        private String address;
        private String location;
        private Double distance;
        private Double rating;
        private Integer price;
        private String phone;
        private String website;
        private String description;
        private String hours;
        private String photoUrl;

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder category(String category) {
            this.category = category;
            return this;
        }

        public Builder categoryId(String categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public Builder coordinates(Double latitude, Double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder distance(Double distance) {
            this.distance = distance;
            return this;
        }

        public Builder rating(Double rating) {
            this.rating = rating;
            return this;
        }

        public Builder price(Integer price) {
            this.price = price;
            return this;
        }

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder website(String website) {
            this.website = website;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder hours(String hours) {
            this.hours = hours;
            return this;
        }

        public Builder photoUrl(String photoUrl) {
            this.photoUrl = photoUrl;
            return this;
        }

        public Place build() {
            return new Place(id, name, category, categoryId, latitude, longitude,
                    address, location, distance, rating, price, phone,
                    website, description, hours, photoUrl);
        }
    }
}