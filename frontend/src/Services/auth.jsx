const API_BASE_URL = 'http://localhost:8080/api';

const getUsersFromStorage = () => {
    try {
        return JSON.parse(localStorage.getItem('wheretogo_users')) || [];
    } catch (error) {
        console.error('Ошибка чтения пользователей:', error);
        return [];
    }
};

const saveUsersToStorage = (users) => {
    try {
        localStorage.setItem('wheretogo_users', JSON.stringify(users));
    } catch (error) {
        console.error('Ошибка сохранения пользователей:', error);
    }
};

// Генерация ID для пользователя
const generateUserId = () => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const loginUser = async (email, password) => {
    try {
        console.log('🔑 Попытка входа:', email);

        // Сначала пробуем через API
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('✅ Вход через API успешен:', userData);
                return userData;
            }
        } catch (apiError) {
            console.log('🌐 API недоступен, используем локальную авторизацию');
        }

        // Локальная авторизация
        const users = getUsersFromStorage();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Неверный email или пароль');
        }

        // Создаем объект пользователя без пароля для безопасности
        const userWithoutPassword = {
            id: user.id,
            email: user.email,
            username: user.username || user.email.split('@')[0],
            registrationDate: user.registrationDate
        };

        console.log('✅ Локальный вход успешен:', userWithoutPassword);

        return {
            message: 'Успешный вход',
            user: userWithoutPassword
        };

    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        throw error;
    }
};

export const registerUser = async (email, password, username = null) => {
    try {
        console.log('📝 Попытка регистрации:', { email, username });

        // Валидация
        if (!email || !password) {
            throw new Error('Email и пароль обязательны');
        }

        if (password.length < 6) {
            throw new Error('Пароль должен содержать минимум 6 символов');
        }

        if (!email.includes('@')) {
            throw new Error('Некорректный email');
        }

        // Сначала пробуем через API
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    username: username || email.split('@')[0]
                }),
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('✅ Регистрация через API успешна:', userData);
                return userData;
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Ошибка регистрации');
            }
        } catch (apiError) {
            console.log('🌐 API недоступен, используем локальную регистрацию');
        }

        // Локальная регистрация
        const users = getUsersFromStorage();

        // Проверяем, не занят ли email
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
        }

        // Создаем нового пользователя
        const newUser = {
            id: generateUserId(),
            email: email,
            password: password, // В реальном приложении пароль должен хешироваться!
            username: username || email.split('@')[0],
            registrationDate: new Date().toISOString()
        };

        // Сохраняем пользователя
        users.push(newUser);
        saveUsersToStorage(users);

        // Возвращаем пользователя без пароля
        const userWithoutPassword = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            registrationDate: newUser.registrationDate
        };

        console.log('✅ Локальная регистрация успешна:', userWithoutPassword);

        return {
            message: 'Регистрация успешна',
            user: userWithoutPassword
        };

    } catch (error) {
        console.error('❌ Ошибка регистрации:', error);
        throw error;
    }
};

// Демо-функция для верификации email (опционально)
export const verifyEmail = async (email, code) => {
    console.log('📧 Верификация email (демо):', { email, code });

    // В демо-режиме просто возвращаем успех
    const users = getUsersFromStorage();
    const user = users.find(u => u.email === email);

    if (!user) {
        throw new Error('Пользователь не найден');
    }

    return {
        message: 'Email успешно подтвержден',
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            registrationDate: user.registrationDate
        }
    };
};

// Вспомогательная функция для отладки
export const getStoredUsers = () => {
    return getUsersFromStorage();
};