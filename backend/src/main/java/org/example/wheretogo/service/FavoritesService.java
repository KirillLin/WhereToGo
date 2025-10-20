package org.example.wheretogo.service;

import org.example.wheretogo.model.Favorite;
import org.example.wheretogo.model.Place;
import org.example.wheretogo.model.User;
import org.example.wheretogo.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavoritesService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    public List<Favorite> getUserFavorites(User user) {
        return favoriteRepository.findByUser(user);
    }

    public Favorite addToFavorites(User user, Place place) {
        // Проверяем, не добавлено ли уже место в избранное
        Optional<Favorite> existingFavorite = favoriteRepository.findByUserAndPlaceId(user, place.getId());
        if (existingFavorite.isPresent()) {
            return existingFavorite.get();
        }

        Favorite favorite = new Favorite(user, place);
        return favoriteRepository.save(favorite);
    }

    public boolean removeFromFavorites(User user, String placeId) {
        if (favoriteRepository.existsByUserAndPlaceId(user, placeId)) {
            favoriteRepository.deleteByUserAndPlaceId(user, placeId);
            return true;
        }
        return false;
    }

    public boolean isFavorite(User user, String placeId) {
        return favoriteRepository.existsByUserAndPlaceId(user, placeId);
    }

    public Optional<Favorite> updateFavoriteNotes(Long favoriteId, String notes) {
        Optional<Favorite> favorite = favoriteRepository.findById(favoriteId);
        if (favorite.isPresent()) {
            favorite.get().setNotes(notes);
            return Optional.of(favoriteRepository.save(favorite.get()));
        }
        return Optional.empty();
    }
}