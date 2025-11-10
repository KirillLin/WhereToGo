import React, { useState, useEffect, useCallback } from 'react';
import { getFavorites, removeFavorite, updateFavorite } from '../Services/api.jsx';
import '../Styles/FavoritesPage.css';

function FavoritesPage({ user }) {
    const [favorites, setFavorites] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    // Используем useCallback для стабильной зависимости
    const loadFavorites = useCallback(async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            console.log('💝 Загрузка избранного с бэкенда для пользователя:', user.id);
            const userFavorites = await getFavorites(user.id);
            console.log('📦 Получены избранные места с бэкенда:', userFavorites);
            setFavorites(userFavorites);
        } catch (error) {
            console.error('❌ Ошибка загрузки избранного:', error);
            alert('Ошибка загрузки избранных мест: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadFavorites();
        }
    }, [user, loadFavorites]);

    const handleRemoveFavorite = async (placeId, placeName) => {
        if (window.confirm(`Удалить "${placeName}" из избранного?`)) {
            try {
                await removeFavorite(user.id, placeId);
                setFavorites(favorites.filter(fav => fav.placeId !== placeId));
                console.log('✅ Место удалено из избранного:', placeName);
            } catch (error) {
                console.error('❌ Ошибка удаления:', error);
                alert('Ошибка при удалении места');
            }
        }
    };

    const startEditNote = (favorite) => {
        setEditingNote(favorite.id);
        setNoteText(favorite.notes || '');
    };

    const saveNote = async (favoriteId, placeName) => {
        try {
            await updateFavorite(favoriteId, noteText);
            setFavorites(favorites.map(fav =>
                fav.id === favoriteId ? { ...fav, notes: noteText } : fav
            ));
            setEditingNote(null);
            console.log('✅ Заметка сохранена для:', placeName);
        } catch (error) {
            console.error('❌ Ошибка сохранения заметки:', error);
            alert('Ошибка при сохранении заметки');
        }
    };

    const cancelEdit = () => {
        setEditingNote(null);
        setNoteText('');
    };

    // Получаем уникальные категории для фильтра
    const categories = ['all', ...new Set(favorites.map(fav => fav.placeCategory))];

    // Фильтруем избранные по категории
    const filteredFavorites = activeCategory === 'all'
        ? favorites
        : favorites.filter(fav => fav.placeCategory === activeCategory);

    // Форматируем дату
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (!user) {
        return (
            <div className="favorites-page">
                <div className="favorites-header">
                    <h1>💝 Мои сохранённые места</h1>
                </div>
                <div className="auth-required">
                    <div className="auth-icon">🔒</div>
                    <h2>Требуется авторизация</h2>
                    <p>Для просмотра избранного необходимо войти в систему</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="favorites-page">
                <div className="favorites-header">
                    <h1>💝 Мои сохранённые места</h1>
                </div>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Загружаем ваши избранные места...</p>
                </div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="favorites-page">
                <div className="favorites-header">
                    <h1>💝 Мои сохранённые места</h1>
                </div>
                <div className="empty-state">
                    <div className="empty-icon">💝</div>
                    <h2>Пока пусто</h2>
                    <p>Сохраняйте понравившиеся места, чтобы не потерять их</p>
                    <div className="empty-tips">
                        <p>💡 <strong>Как добавить место в избранное:</strong></p>
                        <ul>
                            <li>Найдите интересное место на карте</li>
                            <li>Нажмите кнопку "🤍 В избранное"</li>
                            <li>Место появится здесь</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <h1>💝 Мои сохранённые места</h1>
                <div className="favorites-stats">
                    <span className="total-count">{favorites.length} мест</span>
                    {activeCategory !== 'all' && (
                        <span className="filtered-count">
                            ({filteredFavorites.length} в категории)
                        </span>
                    )}
                </div>
            </div>

            {/* Фильтр по категориям */}
            {categories.length > 1 && (
                <div className="categories-filter">
                    <div className="filter-label">Категории:</div>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            🎯 Все
                        </button>
                        {categories.filter(cat => cat !== 'all').map(category => (
                            <button
                                key={category}
                                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {getCategoryIcon(category)} {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="favorites-grid">
                {filteredFavorites.map(favorite => (
                    <div key={favorite.id} className="favorite-card">
                        <div className="favorite-card-header">
                            <div className="place-main-info">
                                <h3 className="place-name">{favorite.placeName}</h3>
                                <span className="place-category">
                                    {getCategoryIcon(favorite.placeCategory)} {favorite.placeCategory}
                                </span>
                            </div>
                            <button
                                className="delete-btn"
                                onClick={() => handleRemoveFavorite(favorite.placeId, favorite.placeName)}
                                title="Удалить из избранного"
                            >
                                🗑️
                            </button>
                        </div>

                        <div className="favorite-card-content">
                            <div className="place-details">
                                <div className="detail-item">
                                    <span className="detail-icon">📍</span>
                                    <span className="detail-text">{favorite.placeAddress}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">📅</span>
                                    <span className="detail-text">
                                        Добавлено: {formatDate(favorite.addedDate)}
                                    </span>
                                </div>
                            </div>

                            <div className="notes-section">
                                <div className="notes-header">
                                    <span className="notes-label">📝 Мои заметки:</span>
                                    {!editingNote && (
                                        <button
                                            className="edit-notes-btn"
                                            onClick={() => startEditNote(favorite)}
                                        >
                                            ✏️ Изменить
                                        </button>
                                    )}
                                </div>

                                {editingNote === favorite.id ? (
                                    <div className="notes-edit">
                                        <textarea
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            placeholder="Добавьте ваши заметки об этом месте..."
                                            rows="3"
                                            className="notes-textarea"
                                        />
                                        <div className="notes-actions">
                                            <button
                                                className="save-btn"
                                                onClick={() => saveNote(favorite.id, favorite.placeName)}
                                            >
                                                💾 Сохранить
                                            </button>
                                            <button
                                                className="cancel-btn"
                                                onClick={cancelEdit}
                                            >
                                                ❌ Отмена
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="notes-display">
                                        <p className={`notes-text ${!favorite.notes ? 'empty-notes' : ''}`}>
                                            {favorite.notes || 'Заметок пока нет...'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Вспомогательная функция для иконок категорий
function getCategoryIcon(category) {
    const icons = {
        'Кафе': '☕',
        'Ресторан': '🍽️',
        'Бар': '🍻',
        'Парк': '🌳',
        'Магазин': '🛒',
        'Музей': '🏛️',
        'Достопримечательность': '📸',
        'Спорт': '💪'
    };
    return icons[category] || '📍';
}

export default FavoritesPage;