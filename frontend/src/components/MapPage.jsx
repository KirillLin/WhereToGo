import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import PlacePopup from './PlacePopup.jsx';
import { getRandomPlaces, addToFavorites } from '../Services/api.jsx';
import { getCurrentLocation } from '../Services/geolocation.jsx';
import 'leaflet/dist/leaflet.css';
import '../Styles/MapPage.css';

// 🔧 ФИКС для иконок маркеров - ОБЯЗАТЕЛЬНО!
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Кастомные иконки
const createCustomIcon = (color = 'red') => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

const userIcon = createCustomIcon('blue');
const placeIcon = createCustomIcon('red');
const favoriteIcon = createCustomIcon('green');

// Компонент для обновления карты при изменении местоположения
function MapUpdater({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);

    return null;
}

// Компонент карточки места
function PlaceCard({ place, onShowDetails, onAddToFavorites, user }) {
    const [isFavorite, setIsFavorite] = useState(place.isFavorite || false);

    const handleAddToFavorites = () => {
        if (!user) {
            alert('Для добавления в избранное необходимо войти в систему');
            return;
        }
        console.log('❤️ Добавление через карточку:', place.name);
        onAddToFavorites(place); // Передаем полный объект места
        setIsFavorite(true);
    };

    const handleShowDetails = () => {
        console.log('🖱️ Нажата кнопка Подробнее для:', place.name);
        onShowDetails(place);
    };

    return (
        <div className="place-card">
            <div className="place-card-header">
                <h3 className="place-card-title">{place.name}</h3>
                <span className="place-card-category">{place.category}</span>
            </div>

            <div className="place-card-info">
                <div className="place-card-details">
                    <span className="place-distance">📍 {Math.round(place.distance)} м</span>
                    {place.rating && (
                        <span className="place-rating">⭐ {place.rating.toFixed(1)}</span>
                    )}
                </div>
                <p className="place-address">{place.address}</p>
            </div>

            <div className="place-card-actions">
                <button
                    className="btn-details"
                    onClick={handleShowDetails}
                >
                    📖 Подробнее
                </button>
                <button
                    className={`btn-favorite ${isFavorite ? 'favorited' : ''}`}
                    onClick={handleAddToFavorites}
                    disabled={isFavorite}
                >
                    {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
                </button>
            </div>
        </div>
    );
}

// Компонент для краткой информации при наведении
function PlaceTooltip({ place }) {
    return (
        <div className="place-tooltip">
            <div className="tooltip-header">
                <h4>{place.name}</h4>
                <span className="tooltip-category">{place.category}</span>
            </div>
            <div className="tooltip-info">
                <span className="tooltip-distance">📍 {Math.round(place.distance)} м</span>
                {place.rating && (
                    <span className="tooltip-rating">⭐ {place.rating.toFixed(1)}</span>
                )}
            </div>
            <p className="tooltip-address">{place.address}</p>
            <div className="tooltip-hint">
                <small>🖱️ Кликните для подробной информации</small>
            </div>
        </div>
    );
}

function MapPage({ user }) {
    const [places, setPlaces] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [showPlacesList, setShowPlacesList] = useState(false);
    const [hoveredPlace, setHoveredPlace] = useState(null);

    // Координаты по умолчанию
    const defaultCenter = [0, 0];
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(13);

    const categories = [
        { value: 'all', label: '🎯 Все места' },
        { value: 'Кафе', label: '☕ Кафе' },
        { value: 'Ресторан', label: '🍽️ Рестораны' },
        { value: 'Бар', label: '🍻 Бары' },
        { value: 'Парк', label: '🌳 Парки' },
        { value: 'Магазин', label: '🛒 Магазины' },
        { value: 'Музей', label: '🏛️ Музеи' },
        { value: 'Достопримечательность', label: '📸 Достопримечательности' }
    ];

    // Загрузка местоположения пользователя
    useEffect(() => {
        loadUserLocation();
    }, []);

    const loadUserLocation = async () => {
        try {
            console.log('📍 Получение местоположения...');
            setIsLoading(true);
            const location = await getCurrentLocation();
            console.log('📍 Получены координаты:', location);

            setUserLocation(location);
            setMapCenter([location.latitude, location.longitude]);
            setMapZoom(15);
        } catch (error) {
            console.error('❌ Ошибка получения местоположения:', error);
            alert('Включите геолокацию ->');
            // Используем координаты по умолчанию
            setUserLocation({ latitude: defaultCenter[0], longitude: defaultCenter[1] });
            setMapCenter(defaultCenter);
            setMapZoom(10);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!userLocation) {
            alert('Сначала нужно получить ваше местоположение');
            return;
        }

        setIsLoading(true);
        try {
            console.log('🔍 Поиск мест...', userLocation);
            const foundPlaces = await getRandomPlaces(
                userLocation.latitude,
                userLocation.longitude,
                12
            );

            console.log('📍 Найдено мест:', foundPlaces);

            // Фильтрация по категории
            const filteredPlaces = selectedCategory === 'all'
                ? foundPlaces
                : foundPlaces.filter(place =>
                    place.category && place.category.toLowerCase().includes(selectedCategory.toLowerCase())
                );

            setPlaces(filteredPlaces);
            setShowPlacesList(true);

            if (filteredPlaces.length === 0) {
                alert('Не найдено мест в выбранной категории. Попробуйте другую категорию.');
            }
        } catch (error) {
            console.error('❌ Ошибка поиска мест:', error);
            alert('Ошибка при поиске мест. Проверьте подключение к интернету.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToFavorites = async (place) => {
        if (!user) {
            alert('Для добавления в избранное необходимо войти в систему');
            return;
        }

        try {
            console.log('❤️ Попытка добавления в избранное:', place.name);

            // Передаем данные места для сохранения в бэкенд
            const result = await addToFavorites(user.id, place.id, {
                name: place.name,
                category: place.category,
                address: place.address,
                latitude: place.latitude,
                longitude: place.longitude,
                distance: place.distance,
                rating: place.rating,
                price: place.price,
                phone: place.phone,
                website: place.website
            });

            console.log('✅ Результат добавления:', result);

            // Обновляем состояние места
            setSelectedPlace({ ...place, isFavorite: true });

            // Обновляем место в списке
            setPlaces(places.map(p =>
                p.id === place.id ? { ...p, isFavorite: true } : p
            ));

            // Показываем уведомление
            alert('✅ Место добавлено в избранное!');

        } catch (error) {
            console.error('❌ Ошибка добавления в избранное:', error);
            alert('❌ Ошибка при добавлении в избранное: ' + error.message);
        }
    };

    const handleRefreshLocation = () => {
        loadUserLocation();
    };

    const handleShowDetails = (place) => {
        console.log('📖 Открытие подробностей места:', place.name);
        setSelectedPlace(place);
    };

    const handleMarkerClick = (place) => {
        console.log('🖱️ Клик по маркеру:', place.name);
        setSelectedPlace(place);
    };

    const handleMarkerMouseOver = (place) => {
        console.log('🐭 Наведение на маркер:', place.name);
        setHoveredPlace(place);
    };

    const handleMarkerMouseOut = () => {
        setHoveredPlace(null);
    };

    const togglePlacesList = () => {
        setShowPlacesList(!showPlacesList);
    };

    // Пока загружается геолокация
    if (isLoading && !userLocation) {
        return (
            <div className="map-page loading">
                <div className="loading-spinner">📍</div>
                <p>Определяем ваше местоположение...</p>
                <small>Разрешите доступ к геолокации в браузере</small>
            </div>
        );
    }

    return (
        <div className="map-page">
            {/* Панель управления */}
            <div className="map-controls">
                <div className="controls-left">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="search-btn primary"
                    >
                        {isLoading ? '🔍 Поиск...' : '🎯 Найти места'}
                    </button>

                    {places.length > 0 && (
                        <button
                            onClick={togglePlacesList}
                            className="toggle-list-btn"
                        >
                            {showPlacesList ? '📋 Скрыть список' : '📋 Показать список'}
                        </button>
                    )}
                </div>

                <div className="controls-right">
                    <button
                        onClick={handleRefreshLocation}
                        className="location-btn"
                        title="Обновить местоположение"
                    >
                        📍 Обновить
                    </button>

                    <div className="location-info">
                        <small>
                            {userLocation ?
                                `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` :
                                'Определение...'
                            }
                        </small>
                    </div>
                </div>
            </div>

            <div className="map-content">
                {/* Список мест */}
                {showPlacesList && places.length > 0 && (
                    <div className="places-sidebar">
                        <div className="places-header">
                            <h3>📋 Найденные места</h3>
                            <span className="places-count">{places.length} мест</span>
                        </div>
                        <div className="places-list">
                            {places.map(place => (
                                <PlaceCard
                                    key={place.id}
                                    place={place}
                                    user={user}
                                    onShowDetails={handleShowDetails}
                                    onAddToFavorites={handleAddToFavorites}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Карта */}
                <div className={`map-container ${showPlacesList ? 'with-sidebar' : ''}`}>
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                        scrollWheelZoom={true}
                    >
                        {/* Основной слой карты - OpenStreetMap */}
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* Обновление карты при изменении центра */}
                        <MapUpdater center={mapCenter} zoom={mapZoom} />

                        {/* Маркер пользователя */}
                        {userLocation && (
                            <Marker
                                position={[userLocation.latitude, userLocation.longitude]}
                                icon={userIcon}
                            >
                                <Popup>
                                    <div className="user-popup">
                                        <h4>📍 Вы здесь</h4>
                                        <p>Ваше текущее местоположение</p>
                                        <div className="coordinates">
                                            <strong>Широта:</strong> {userLocation.latitude.toFixed(6)}<br/>
                                            <strong>Долгота:</strong> {userLocation.longitude.toFixed(6)}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Маркеры найденных мест */}
                        {places.map(place => (
                            <Marker
                                key={place.id}
                                position={[place.latitude, place.longitude]}
                                icon={place.isFavorite ? favoriteIcon : placeIcon}
                                eventHandlers={{
                                    click: () => handleMarkerClick(place),
                                    mouseover: () => handleMarkerMouseOver(place),
                                    mouseout: handleMarkerMouseOut
                                }}
                            />
                        ))}
                    </MapContainer>

                    {/* Всплывающая подсказка при наведении */}
                    {hoveredPlace && (
                        <div className="map-tooltip">
                            <PlaceTooltip place={hoveredPlace} />
                        </div>
                    )}
                </div>
            </div>

            {/* Статус поиска */}
            {isLoading && (
                <div className="search-status">
                    <div className="spinner"></div>
                    <span>Ищем интересные места рядом...</span>
                </div>
            )}

            {/* Попап с детальной информацией о месте */}
            {selectedPlace && (
                <PlacePopup
                    place={selectedPlace}
                    user={user}
                    onClose={() => setSelectedPlace(null)}
                    onAddToFavorites={handleAddToFavorites}
                />
            )}
        </div>
    );
}

export default MapPage;