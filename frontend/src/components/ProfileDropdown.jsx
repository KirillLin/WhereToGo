import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileDropdown({ user, onLoginClick, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleFavoritesClick = () => {
        if (user) {
            navigate('/favorites');
        } else {
            onLoginClick();
        }
        setIsOpen(false);
    };

    return (
        <div className="profile-dropdown">
            <button
                className="profile-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                {user ? `👤 ${user.username}` : 'Войти'}
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    {user ? (
                        <>
                            <button onClick={handleFavoritesClick}>
                                💝 Мои места
                            </button>
                            <button onClick={() => { onLogout(); setIsOpen(false); }}>
                                🚪 Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => { onLoginClick(); setIsOpen(false); }}>
                                🔑 Войти
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProfileDropdown;