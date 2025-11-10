import React, { useState } from 'react';
import { loginUser, registerUser } from '../Services/auth.jsx';
import '../Styles/AuthModal.css';

function AuthModal({ mode, onLogin, onClose, onSwitchMode }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log(`📨 Отправка формы: ${mode}`, {
                email: formData.email,
                hasPassword: !!formData.password
            });

            if (mode === 'login') {
                // Логин
                const result = await loginUser(formData.email, formData.password);
                console.log('✅ Результат входа:', result);

                if (result.user) {
                    onLogin(result.user);
                } else {
                    throw new Error('Неверный ответ от сервера');
                }
            } else {
                // Регистрация
                if (formData.password !== formData.confirmPassword) {
                    setError('Пароли не совпадают');
                    return;
                }

                if (formData.password.length < 6) {
                    setError('Пароль должен содержать минимум 6 символов');
                    return;
                }

                const result = await registerUser(formData.email, formData.password);
                console.log('✅ Результат регистрации:', result);

                if (result.user) {
                    onLogin(result.user);
                }
            }
        } catch (error) {
            console.error('❌ Ошибка в AuthModal:', error);
            setError(error.message || 'Произошла неизвестная ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        setFormData({
            email: '',
            password: '',
            confirmPassword: ''
        });
        onClose();
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <button className="close-btn" onClick={handleClose}>×</button>

                <h2>{mode === 'login' ? 'Вход в систему' : 'Регистрация'}</h2>

                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength={6}
                            placeholder="Не менее 6 символов"
                        />
                    </div>

                    {mode === 'register' && (
                        <div className="form-group">
                            <label>Подтверждение пароля:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                minLength={6}
                                placeholder="Повторите пароль"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? '⏳ Загрузка...' :
                            mode === 'login' ? '🔑 Войти' : '📝 Зарегистрироваться'}
                    </button>
                </form>

                <div className="auth-switch">
                    {mode === 'login' ? (
                        <p>
                            Нет аккаунта?{' '}
                            <button type="button" onClick={onSwitchMode} className="link-btn">
                                Зарегистрироваться
                            </button>
                        </p>
                    ) : (
                        <p>
                            Уже есть аккаунт?{' '}
                            <button type="button" onClick={onSwitchMode} className="link-btn">
                                Войти
                            </button>
                        </p>
                    )}
                </div>

                <div className="auth-info">
                    <small>
                        {mode === 'login'
                            ? 'Используйте email и пароль для входа'
                            : 'Регистрация сохранит ваш аккаунт в этом браузере'
                        }
                    </small>
                </div>
            </div>
        </div>
    );
}

export default AuthModal;