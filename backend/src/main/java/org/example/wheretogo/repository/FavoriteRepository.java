package org.example.wheretogo.repository;

import org.example.wheretogo.model.Favorite;
import org.example.wheretogo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    Optional<Favorite> findByUserAndPlaceId(User user, String placeId);
    boolean existsByUserAndPlaceId(User user, String placeId);
    void deleteByUserAndPlaceId(User user, String placeId);
}