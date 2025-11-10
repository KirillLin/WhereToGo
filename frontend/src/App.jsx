import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from './components/WelcomePage.jsx';
import MapPage from './components/MapPage.jsx';
import FavoritesPage from './components/FavoritesPage.jsx';
import AuthModal from './components/AuthModal.jsx';
import ProfileDropdown from './components/ProfileDropdown.jsx';
import './Styles/App.css';

// Компонент для отладки маршрутизации
function DebugRouter() {
    const location = useLocation();
    useEffect(() => {
        console.log('📍 Текущий путь:', location.pathname);
    }, [location.pathname]);

    return null;
}

function App() {
    const [user, setUser] = useState(() => {
        // Инициализация пользователя из localStorage
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('❌ Ошибка при чтении пользователя из localStorage:', error);
            return null;
        }
    });

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    console.log('🚀 App перерендерен, пользователь:', user);

    // Синхронизация пользователя с localStorage
    useEffect(() => {
        if (user) {
            try {
                localStorage.setItem('user', JSON.stringify(user));
                console.log('💾 Пользователь сохранен в localStorage');
            } catch (error) {
                console.error('❌ Ошибка при сохранении пользователя:', error);
            }
        }
    }, [user]);

    const handleLogin = (userData) => {
        console.log('🔑 Вход пользователя:', userData);

        // Обрабатываем разные форматы ответа от сервера
        const userToSave = userData.user || userData;

        if (!userToSave || !userToSave.id) {
            console.error('❌ Неверный формат данных пользователя:', userData);
            alert('Ошибка: неверный формат данных пользователя');
            return;
        }

        setUser(userToSave);
        setShowAuthModal(false);

        // Показываем уведомление об успешном входе
        setTimeout(() => {
            alert(`✅ Добро пожаловать, ${userToSave.username || userToSave.email}!`);
        }, 100);
    };

    const handleLogout = () => {
        console.log('🚪 Выход пользователя');
        setUser(null);
        try {
            localStorage.removeItem('user');
            console.log('💾 Пользователь удален из localStorage');
        } catch (error) {
            console.error('❌ Ошибка при удалении пользователя:', error);
        }

        // Показываем уведомление о выходе
        setTimeout(() => {
            alert('👋 Вы вышли из системы');
        }, 100);
    };

    const handleAuthClick = () => {
        console.log('🔄 Открытие модалки авторизации');
        setAuthMode('login');
        setShowAuthModal(true);
    };

    const handleSwitchAuthMode = () => {
        const newMode = authMode === 'login' ? 'register' : 'login';
        console.log('🔄 Смена режима авторизации:', newMode);
        setAuthMode(newMode);
    };

    const handleCloseAuthModal = () => {
        console.log('❌ Закрытие модалки авторизации');
        setShowAuthModal(false);
        // Сбрасываем режим на вход при закрытии
        setAuthMode('login');
    };

    return (
        <Router>
            <div className="App">
                <DebugRouter />

                <header className="app-header">
                    <div className="header-content">
                        <h1 className="app-title">🗺️ Куда сходить?</h1>
                        <ProfileDropdown
                            user={user}
                            onLoginClick={handleAuthClick}
                            onLogout={handleLogout}
                        />
                    </div>
                </header>

                <main className="app-main">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <WelcomePage
                                    onStart={handleAuthClick}
                                />
                            }
                        />
                        <Route
                            path="/map"
                            element={
                                <MapPage user={user} />
                            }
                        />
                        <Route
                            path="/favorites"
                            element={
                                <FavoritesPage user={user} />
                            }
                        />
                        {/* Резервный маршрут для несуществующих путей */}
                        <Route
                            path="*"
                            element={
                                <div style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '50vh'
                                }}>
                                    <h2>🚧 Страница не найдена</h2>
                                    <p>Запрошенная страница не существует.</p>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        style={{
                                            marginTop: '1rem',
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🔙 На главную
                                    </button>
                                </div>
                            }
                        />
                    </Routes>
                </main>

                {showAuthModal && (
                    <AuthModal
                        mode={authMode}
                        onLogin={handleLogin}
                        onClose={handleCloseAuthModal}
                        onSwitchMode={handleSwitchAuthMode}
                    />
                )}

                {/* Футер приложения */}
                <footer className="app-footer">
                    <div className="footer-content">
                        <p>© 2024 Куда сходить? • Сервис поиска мест рядом</p>
                        <div className="footer-links">
                            <span>📍 Использует OpenStreetMap</span>
                            {user && (
                                <span>👤 {user.username || user.email}</span>
                            )}
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;