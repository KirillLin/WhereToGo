import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/WelcomePage.css';

function WelcomePage({ onStart }) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    console.log('🎯 WelcomePage загружен');

    const handleStart = async () => {
        console.log('🔄 Нажата кнопка "Начать"');
        setIsLoading(true);

        try {
            console.log('📍 Пытаемся перейти на /map...');
            navigate('/map');
            console.log('✅ navigate вызван');
        } catch (error) {
            console.error('❌ Ошибка при переходе:', error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                console.log('🔄 Состояние загрузки сброшено');
            }, 1000);
        }
    };

    const handleFavorites = () => {
        console.log('💝 Нажата кнопка "Мои места"');
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            console.log('📍 Переход на /favorites');
            navigate('/favorites');
        } else {
            console.log('🔑 Открытие авторизации');
            onStart();
        }
    };

    return (
        <div className="welcome-page">
            <div className="welcome-content">
                <div className="hero-section">
                    <h1 className="app-title">Куда сходить?</h1>
                    <p className="app-description">
                        Откройте для себя новые места рядом с вами.
                        Наш сервис поможет найти интересные кафе, парки, музеи и многое другое.
                    </p>
                </div>

                <div className="action-buttons">
                    <button
                        className="btn btn-primary"
                        onClick={handleStart}
                        disabled={isLoading}
                    >
                        {isLoading ? '🚀 Загрузка...' : '🎯 Начать'}
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={handleFavorites}
                    >
                        💝 Мои места
                    </button>
                </div>

                <div className="debug-info" style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                }}>
                    <p>Для работы необходим доступ к геолокации, он будет запрошен при нажатии на Начать</p>
                    <p>Без геолокации мы не сможем определить ваше местоположение и найти для вас интересные места</p>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;