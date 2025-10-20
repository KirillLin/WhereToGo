package org.example.wheretogo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites")
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String placeId;
    private String placeName;
    private String placeCategory;
    private Double placeLatitude;
    private Double placeLongitude;
    private String placeAddress;
    private LocalDateTime addedDate;
    private String notes;

    public Favorite() {}

    public Favorite(User user, Place place) {
        this.user = user;
        this.placeId = place.getId();
        this.placeName = place.getName();
        this.placeCategory = place.getCategory();
        this.placeLatitude = place.getLatitude();
        this.placeLongitude = place.getLongitude();
        this.placeAddress = place.getAddress();
        this.addedDate = LocalDateTime.now();
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getPlaceName() { return placeName; }
    public void setPlaceName(String placeName) { this.placeName = placeName; }

    public String getPlaceCategory() { return placeCategory; }
    public void setPlaceCategory(String placeCategory) { this.placeCategory = placeCategory; }

    public Double getPlaceLatitude() { return placeLatitude; }
    public void setPlaceLatitude(Double placeLatitude) { this.placeLatitude = placeLatitude; }

    public Double getPlaceLongitude() { return placeLongitude; }
    public void setPlaceLongitude(Double placeLongitude) { this.placeLongitude = placeLongitude; }

    public String getPlaceAddress() { return placeAddress; }
    public void setPlaceAddress(String placeAddress) { this.placeAddress = placeAddress; }

    public LocalDateTime getAddedDate() { return addedDate; }
    public void setAddedDate(LocalDateTime addedDate) { this.addedDate = addedDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}