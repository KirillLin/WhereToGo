const API_BASE_URL = 'http://localhost:8080/api';

// Places API
export const getRandomPlaces = async (lat, lon, count = 5) => {
    try {
        console.log(`🌐 Запрос к API: /places/random?lat=${lat}&lon=${lon}&count=${count}`);

        const response = await fetch(
            `${API_BASE_URL}/places/random?lat=${lat}&lon=${lon}&count=${count}`
        );

        console.log('📊 Статус ответа:', response.status);

        if (!response.ok) {
            console.warn('⚠️ Сервер недоступен, используем демо-данные');
            return getDemoPlaces(lat, lon, count);
        }

        const data = await response.json();
        console.log('📦 Получены данные:', data);

        if (!Array.isArray(data)) {
            console.warn('⚠️ Неверный формат данных, используем демо-данные');
            return getDemoPlaces(lat, lon, count);
        }

        return data;
    } catch (error) {
        console.error('💥 Ошибка в getRandomPlaces, используем демо-данные:', error);
        return getDemoPlaces(lat, lon, count);
    }
};

const getDemoPlaces = (lat, lon, count) => {
    console.log('🎭 Используем демо-данные');

    const demoPlaces = [
        {
            id: 'minsk_1_' + Date.now(),
            name: 'Ресторан "Гвоздь"',
            category: 'Ресторан',
            latitude: 53.9147,
            longitude: 27.5898,
            address: 'ул. Гикало, 5, Минск',
            distance: 300,
            rating: 4.9,
            phone: '+375 29 606-03-97',
            price: 1
        },
        {
            id: 'minsk_2_' + Date.now(),
            name: 'Irish pub Клевер',
            category: 'Ресторан',
            latitude: 53.9150,
            longitude: 27.5889,
            address: 'ул. Гикало, 5 (5), Минск',
            distance: 450,
            rating: 5,
            price: 1
        },
        {
            id: 'minsk_3_' + Date.now(),
            name: 'LedBeer Двор',
            category: 'Ресторан',
            latitude: 53.9157,
            longitude: 27.5886,
            address: 'ул. Гикало 5-6, Минск',
            distance: 500,
            rating: 4.5,
            price: 2
        },
        {
            id: 'minsk_4_' + Date.now(),
            name: 'Минская областная библиотека"',
            category: 'Библиотека',
            latitude: 53.9150,
            longitude: 27.5877,
            address: 'ул. Гикало 4, Минск',
            distance: 550,
            rating: 4.6,
            phone: '+375 17 345-67-89',
            price: 2
        },
        {
            id: 'minsk_5_' + Date.now(),
            name: 'Коптильня',
            category: 'Ресторан',
            latitude: 53.9316,
            longitude: 27.5917,
            address: 'ул. Гикало, 7, Минск',
            distance: 280,
            rating: 4.9,
            phone: '+375 29 666-88-98',
            price: 2
        },
        {
            id: 'minsk_6_' + Date.now(),
            name: 'Столовая БГУИР 4к',
            category: 'Кафе',
            latitude: 53.9120,
            longitude: 27.5950,
            address: 'ул. Гикало, 9, Минск',
            distance: 50,
            rating: 4.8,
            price: 2
        },
        {
            id: 'minsk_7_' + Date.now(),
            name: 'Батуми',
            category: 'Кафе',
            latitude: 53.9098,
            longitude: 27.5973,
            address: 'ул. Платонова, 20Б, Минск',
            distance: 200,
            rating: 4.8,
            phone: '+375 29 956-26-84',
            price: 2
        },
        {
            id: 'minsk_8_' + Date.now(),
            name: 'Пекаридзе',
            category: 'Кафе',
            latitude: 53.9124,
            longitude: 27.5981,
            address: 'ул. Платонова, 45, Минск',
            distance: 150,
            rating: 4.4,
            price: 3
        },
        {
            id: 'minsk_9_' + Date.now(),
            name: 'Зелёный попугай - караоке бар',
            category: 'Бар',
            latitude: 53.9130,
            longitude: 27.6010,
            address: 'ул. П.Бровки, 15/2, Минск',
            distance: 500,
            rating: 3.9,
        },
        {
            id: 'minsk_10_' + Date.now(),
            name: 'ЗАКУТОК',
            category: 'Кафе',
            latitude: 53.9141,
            longitude: 27.5997,
            address: 'ул. П.Бровки, 16А, Минск',
            distance: 550,
            rating: 4.7,
        },
        {
            id: 'minsk_11_' + Date.now(),
            name: 'Бондаревский Сквер',
            category: 'Магазин',
            latitude: 53.9156,
            longitude: 27.5872,
            address: 'ул. Гикало, Минск',
            distance: 700,
            rating: 3.7,
        },
        {
            id: 'minsk_12_' + Date.now(),
            name: 'Burger King',
            category: 'Кафе',
            latitude: 53.9167,
            longitude: 27.5865,
            address: 'пр. Независимости, 56',
            distance: 750,
            rating: 4.4,
            phone: '+375 44 598-24-90'
        },
        {
            id: 'minsk_13_' + Date.now(),
            name: 'Молодёжный театр"',
            category: 'Развлечения',
            latitude: 53.9987,
            longitude: 27.5886,
            address: 'ул. Козлова, 17',
            distance: 550,
            rating: 4.9,
            phone: '+375 17 360-23-82'
        },
        {
            id: 'minsk_14_' + Date.now(),
            name: 'Ботанический сад',
            category: 'Парк',
            latitude: 53.9158,
            longitude: 27.6078,
            address: 'ул. Сурганова, 2В',
            distance: 600,
            rating: 5,
            website: 'https://cbg.org.by',
            price: 1
        },
        {
            id: 'minsk_15_' + Date.now(),
            name: 'Аквапарк Фристайл',
            category: 'Развлечения',
            latitude: 53.9180,
            longitude: 27.6054,
            address: 'ул. Сурганова, 4А, Минск',
            distance: 700,
            rating: 5,
            phone: '+375 17 287-97-00'
        },
        {
            id: 'minsk_16_' + Date.now(),
            name: 'Бассейн Swimming.by',
            category: 'Развлечения',
            latitude: 53.9187,
            longitude: 27.6066,
            address: 'ул. Сурганова, 2А, Минск',
            distance: 800,
            rating: 4.9,
            phone: '+375 29 703-93-90',
            price: 2
        },
        {
            id: 'minsk_17_' + Date.now(),
            name: 'Сквер Чанчунь',
            category: 'Парк',
            latitude: 53.9115,
            longitude: 27.5908,
            address: 'ул. Берестянская, Минск',
            distance: 120,
            rating: 4.5,
        },
        {
            id: 'minsk_18_' + Date.now(),
            name: 'Brutto',
            category: 'Бар',
            latitude: 53.9152,
            longitude: 27.5994,
            address: 'ул. П.Бровки, 3/2, Минск',
            distance: 600,
            rating: 4.6,
            price: 2
        }
    ];

    // Перемешиваем массив и возвращаем нужное количество
    const shuffled = [...demoPlaces].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
};

export const searchPlaces = async (query, lat, lon) => {
    try {
        console.log(`🔍 Поиск: ${query} near ${lat},${lon}`);

        const response = await fetch(
            `${API_BASE_URL}/places/search?query=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}`
        );


        if (!response.ok) {
            console.warn('⚠️ Сервер недоступен, используем демо-данные для поиска');
            const allPlaces = getDemoPlaces(lat, lon, 20);
            return allPlaces.filter(place =>
                place.name.toLowerCase().includes(query.toLowerCase()) ||
                place.category.toLowerCase().includes(query.toLowerCase())
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            const allPlaces = getDemoPlaces(lat, lon, 20);
            return allPlaces.filter(place =>
                place.name.toLowerCase().includes(query.toLowerCase()) ||
                place.category.toLowerCase().includes(query.toLowerCase())
            );
        }

        return data;
    } catch (error) {
        console.error('💥 Ошибка в searchPlaces, используем демо-данные:', error);
        const allPlaces = getDemoPlaces(lat, lon, 20);
        return allPlaces.filter(place =>
            place.name.toLowerCase().includes(query.toLowerCase()) ||
            place.category.toLowerCase().includes(query.toLowerCase())
        );
    }
};

export const getFavorites = async (userId) => {
    try {
        console.log('💝 Получение избранного с бэкенда для пользователя:', userId);

        const response = await fetch(`${API_BASE_URL}/favorites/${userId}`);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const favorites = await response.json();
        console.log('📦 Получены избранные места с бэкенда:', favorites);
        return favorites;

    } catch (error) {
        console.error('❌ Ошибка получения избранного с бэкенда:', error);
        // Fallback на локальные данные если бэкенд недоступен
        return getLocalFavorites(userId);
    }
};

export const addToFavorites = async (userId, placeId, placeData = null) => {
    try {
        console.log('➕ Добавление в избранное через бэкенд:', { userId, placeId, placeData });

        const requestBody = {
            placeId: placeId,
            placeData: placeData
        };

        const response = await fetch(`${API_BASE_URL}/favorites/${userId}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Место добавлено в избранное через бэкенд:', result);
        return result;

    } catch (error) {
        console.error('❌ Ошибка добавления в избранное через бэкенд:', error);
        // Fallback на локальное сохранение
        return addToLocalFavorites(userId, placeId, placeData);
    }
};

export const removeFavorite = async (userId, placeId) => {
    try {
        console.log('➖ Удаление из избранного через бэкенд:', { userId, placeId });

        const response = await fetch(`${API_BASE_URL}/favorites/${userId}/remove/${placeId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Место удалено из избранного через бэкенд:', result);
        return result;

    } catch (error) {
        console.error('❌ Ошибка удаления из избранного через бэкенд:', error);
        // Fallback на локальное удаление
        return removeLocalFavorite(userId, placeId);
    }
};

export const updateFavorite = async (favoriteId, notes) => {
    try {
        console.log('📝 Обновление заметки через бэкенд:', { favoriteId, notes });

        const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}/notes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notes: notes })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Заметка обновлена через бэкенд:', result);
        return result;

    } catch (error) {
        console.error('❌ Ошибка обновления заметки через бэкенд:', error);
        // Fallback на локальное обновление
        return updateLocalFavorite(favoriteId, notes);
    }
};

// Локальные fallback-функции (на случай если бэкенд недоступен)
const getLocalFavorites = (userId) => {
    try {
        const favorites = JSON.parse(localStorage.getItem('wheretogo_favorites')) || [];
        return favorites.filter(fav => fav.userId === userId);
    } catch (error) {
        console.error('Ошибка получения локальных избранных:', error);
        return [];
    }
};

const addToLocalFavorites = (userId, placeId, placeData) => {
    try {
        const favorites = JSON.parse(localStorage.getItem('wheretogo_favorites')) || [];

        const newFavorite = {
            id: Date.now(),
            userId: userId,
            placeId: placeId,
            placeName: placeData?.name || `Место ${placeId}`,
            placeCategory: placeData?.category || 'Неизвестно',
            placeAddress: placeData?.address || 'Адрес не указан',
            placeLatitude: placeData?.latitude || 55.7558,
            placeLongitude: placeData?.longitude || 37.6173,
            addedDate: new Date().toISOString(),
            notes: ''
        };

        favorites.push(newFavorite);
        localStorage.setItem('wheretogo_favorites', JSON.stringify(favorites));

        return {
            message: 'Место добавлено в избранное (локально)',
            favorite: newFavorite
        };
    } catch (error) {
        console.error('Ошибка локального добавления:', error);
        throw error;
    }
};

const removeLocalFavorite = (userId, placeId) => {
    try {
        const favorites = JSON.parse(localStorage.getItem('wheretogo_favorites')) || [];
        const updatedFavorites = favorites.filter(fav =>
            !(fav.userId === userId && fav.placeId === placeId)
        );
        localStorage.setItem('wheretogo_favorites', JSON.stringify(updatedFavorites));

        return { message: 'Место удалено из избранного (локально)' };
    } catch (error) {
        console.error('Ошибка локального удаления:', error);
        throw error;
    }
};

const updateLocalFavorite = (favoriteId, notes) => {
    try {
        const favorites = JSON.parse(localStorage.getItem('wheretogo_favorites')) || [];
        const updatedFavorites = favorites.map(fav => {
            if (fav.id === favoriteId) {
                return { ...fav, notes: notes };
            }
            return fav;
        });
        localStorage.setItem('wheretogo_favorites', JSON.stringify(updatedFavorites));

        const updatedFavorite = updatedFavorites.find(fav => fav.id === favoriteId);
        return {
            message: 'Заметка обновлена (локально)',
            favorite: updatedFavorite
        };
    } catch (error) {
        console.error('Ошибка локального обновления:', error);
        throw error;
    }
};