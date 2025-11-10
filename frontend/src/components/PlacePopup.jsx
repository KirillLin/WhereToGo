import React, { useState } from 'react';
import '../Styles/PlacePopup.css';

function PlacePopup({ place, user, onClose, onAddToFavorites }) {
    const [isFavorite, setIsFavorite] = useState(place.isFavorite || false);

    console.log('🎪 PlacePopup открыт для:', place.name);

    const handleFavoriteClick = () => {
        console.log('❤️ Добавление в избранное через попап:', place.name);
        if (!isFavorite) {
            onAddToFavorites(place); // Передаем полный объект места
            setIsFavorite(true);
        }
    };

    const handleClose = () => {
        console.log('❌ Закрытие PlacePopup');
        onClose();
    };

    if (!place) {
        console.error('❌ PlacePopup: place is null');
        return null;
    }

    return (
        <div className="place-popup-overlay" onClick={handleClose}>
            <div className="place-popup" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={handleClose}>×</button>

                <div className="place-popup-header">
                    <h2>{place.name}</h2>
                    <span className="place-category">{place.category}</span>
                </div>

                <div className="place-popup-content">
                    <div className="place-info-section">
                        <div className="info-row">
                            <strong>📍 Адрес:</strong>
                            <span>{place.address}</span>
                        </div>

                        {place.distance && (
                            <div className="info-row">
                                <strong>📏 Расстояние:</strong>
                                <span>{Math.round(place.distance)} метров от вас</span>
                            </div>
                        )}

                        {place.rating && (
                            <div className="info-row">
                                <strong>⭐ Рейтинг:</strong>
                                <span>{place.rating.toFixed(1)} / 5</span>
                            </div>
                        )}

                        {place.price && (
                            <div className="info-row">
                                <strong>💰 Ценовой диапазон:</strong>
                                <span>{'💰'.repeat(place.price)}</span>
                            </div>
                        )}

                        {place.phone && (
                            <div className="info-row">
                                <strong>📞 Телефон:</strong>
                                <span>{place.phone}</span>
                            </div>
                        )}

                        {place.website && (
                            <div className="info-row">
                                <strong>🌐 Сайт:</strong>
                                <a href={place.website} target="_blank" rel="noopener noreferrer">
                                    {place.website}
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="place-popup-actions">
                        <button
                            className={`favorite-btn large ${isFavorite ? 'favorited' : ''}`}
                            onClick={handleFavoriteClick}
                            disabled={isFavorite}
                        >
                            {isFavorite ? '❤️ В избранном' : '🤍 Добавить в избранное'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlacePopup;