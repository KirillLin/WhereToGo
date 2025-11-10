export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Геолокация не поддерживается браузером'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                let errorMessage = 'Не удалось получить местоположение';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Доступ к геолокации запрещен';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Информация о местоположении недоступна';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Время ожидания истекло';
                        break;
                }

                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
};