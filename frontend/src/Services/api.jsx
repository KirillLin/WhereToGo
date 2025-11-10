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

// Функция с демо-данными
const getDemoPlaces = (lat, lon, count) => {
    console.log('🎭 Используем демо-данные');

    const demoPlaces = [
        {
            id: 'minsk_1_' + Date.now(),
            name: 'Кафе "Бульбяная"',
            category: 'Кафе',
            latitude: 53.9185,
            longitude: 27.5968,
            address: 'ул. Платонова, 41',
            distance: 150,
            rating: 4.3,
            phone: '+375 17 234-56-78',
            price: 1
        },
        {
            id: 'minsk_2_' + Date.now(),
            name: 'Столовая БГУИР',
            category: 'Кафе',
            latitude: 53.9178,
            longitude: 27.5972,
            address: 'ул. Платонова, 39 (корпус 5)',
            distance: 50,
            rating: 3.8,
            price: 1
        },
        {
            id: 'minsk_3_' + Date.now(),
            name: 'Кофейня "Кофеин"',
            category: 'Кафе',
            latitude: 53.9191,
            longitude: 27.5953,
            address: 'ул. Платонова, 37',
            distance: 200,
            rating: 4.5,
            phone: '+375 29 123-45-67',
            price: 2
        },
        {
            id: 'minsk_4_' + Date.now(),
            name: 'Суши-бар "Якитория"',
            category: 'Ресторан',
            latitude: 53.9202,
            longitude: 27.5981,
            address: 'пр. Независимости, 177',
            distance: 350,
            rating: 4.2,
            phone: '+375 17 345-67-89',
            price: 2
        },
        {
            id: 'minsk_5_' + Date.now(),
            name: 'Пиццерия "Додо Пицца"',
            category: 'Ресторан',
            latitude: 53.9167,
            longitude: 27.5993,
            address: 'ул. Платонова, 45',
            distance: 280,
            rating: 4.4,
            phone: '+375 29 765-43-21',
            website: 'https://dodopizza.by',
            price: 2
        },
        {
            id: 'minsk_6_' + Date.now(),
            name: 'Бургерная "Бургер Клаб"',
            category: 'Ресторан',
            latitude: 53.9210,
            longitude: 27.5945,
            address: 'ул. Сурганова, 47',
            distance: 420,
            rating: 4.1,
            price: 2
        },
        {
            id: 'minsk_7_' + Date.now(),
            name: 'Бар "Хутор"',
            category: 'Бар',
            latitude: 53.9158,
            longitude: 27.6012,
            address: 'ул. Платонова, 51',
            distance: 500,
            rating: 4.0,
            phone: '+375 17 456-78-90',
            price: 2
        },
        {
            id: 'minsk_8_' + Date.now(),
            name: 'Паб "Гамбринус"',
            category: 'Бар',
            latitude: 53.9223,
            longitude: 27.5921,
            address: 'ул. Сурганова, 41',
            distance: 600,
            rating: 4.6,
            price: 3
        },
        {
            id: 'minsk_9_' + Date.now(),
            name: 'Парк Челюскинцев',
            category: 'Парк',
            latitude: 53.9235,
            longitude: 27.5897,
            address: 'пр. Независимости, 185',
            distance: 800,
            rating: 4.7,
            website: 'https://parki.by'
        },
        {
            id: 'minsk_10_' + Date.now(),
            name: 'Ботанический сад',
            category: 'Парк',
            latitude: 53.9123,
            longitude: 27.6054,
            address: 'ул. Сурганова, 2в',
            distance: 950,
            rating: 4.8,
            website: 'https://hbc.bas-net.by'
        },
        {
            id: 'minsk_11_' + Date.now(),
            name: 'ТЦ "Скала"',
            category: 'Магазин',
            latitude: 53.9241,
            longitude: 27.5872,
            address: 'пр. Независимости, 181',
            distance: 700,
            rating: 4.0,
            phone: '+375 17 567-89-01'
        },
        {
            id: 'minsk_12_' + Date.now(),
            name: 'Супермаркет "Евроопт"',
            category: 'Магазин',
            latitude: 53.9145,
            longitude: 27.6031,
            address: 'ул. Платонова, 55',
            distance: 550,
            rating: 3.9,
            phone: '+375 17 678-90-12'
        },
        {
            id: 'minsk_13_' + Date.now(),
            name: 'Книжный магазин "Академкнига"',
            category: 'Магазин',
            latitude: 53.9172,
            longitude: 27.5958,
            address: 'ул. Платонова, 35',
            distance: 180,
            rating: 4.2,
            phone: '+375 17 789-01-23'
        },
        {
            id: 'minsk_14_' + Date.now(),
            name: 'Национальная библиотека',
            category: 'Достопримечательность',
            latitude: 53.9317,
            longitude: 27.6461,
            address: 'пр. Независимости, 116',
            distance: 3500,
            rating: 4.9,
            website: 'https://nlb.by',
            price: 1
        },
        {
            id: 'minsk_15_' + Date.now(),
            name: 'Музей истории БГУИР',
            category: 'Музей',
            latitude: 53.9180,
            longitude: 27.5965,
            address: 'ул. Платонова, 39 (корпус 1)',
            distance: 80,
            rating: 4.3,
            phone: '+375 17 890-12-34'
        },
        {
            id: 'minsk_16_' + Date.now(),
            name: 'Спортзал "Атлетик-холл"',
            category: 'Спорт',
            latitude: 53.9138,
            longitude: 27.6045,
            address: 'ул. Сурганова, 10',
            distance: 650,
            rating: 4.4,
            phone: '+375 29 234-56-78',
            price: 2
        },
        {
            id: 'minsk_17_' + Date.now(),
            name: 'Бассейн БГУИР',
            category: 'Спорт',
            latitude: 53.9165,
            longitude: 27.5982,
            address: 'ул. Платонова, 39 (корпус 4)',
            distance: 120,
            rating: 4.1,
            phone: '+375 17 901-23-45'
        },
        {
            id: 'minsk_18_' + Date.now(),
            name: 'Кинотеатр "Москва"',
            category: 'Кинотеатр',
            latitude: 53.8967,
            longitude: 27.5478,
            address: 'пр. Независимости, 13',
            distance: 3800,
            rating: 4.2,
            website: 'https://kinominsk.by',
            price: 2
        },
        {
            id: 'minsk_19_' + Date.now(),
            name: 'Кафе "Лидо"',
            category: 'Кафе',
            latitude: 53.9098,
            longitude: 27.5763,
            address: 'пр. Победителей, 9',
            distance: 2200,
            rating: 4.0,
            phone: '+375 17 012-34-56',
            price: 1
        },
        {
            id: 'minsk_20_' + Date.now(),
            name: 'Ресторан "Раковский Бровар"',
            category: 'Ресторан',
            latitude: 53.9067,
            longitude: 27.5542,
            address: 'ул. Витебская, 10',
            distance: 3200,
            rating: 4.5,
            phone: '+375 29 345-67-89',
            website: 'https://rakovsky.by',
            price: 3
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

// Favorites API - ПЕРЕПИСАТЬ для работы с бэкендом
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