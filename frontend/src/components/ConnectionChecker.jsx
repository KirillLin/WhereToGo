class ConnectionChecker {
    static async checkGPS() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.error('❌ Геолокация не поддерживается браузером');
                alert('Ваш браузер не поддерживает геолокацию. Пожалуйста, используйте современный браузер.');
                resolve(false);
                return;
            }

            console.log('📍 Проверка доступа к геолокации...');

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('✅ Геолокация доступна');
                    console.log('Координаты:', {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                    resolve(true);
                },
                (error) => {
                    let errorMessage = 'Не удалось получить местоположение';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '❌ Доступ к геолокации запрещен. Пожалуйста, разрешите доступ к геолокации в настройках браузера.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '❌ Информация о местоположении недоступна. Проверьте, включена ли GPS на вашем устройстве.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = '❌ Время ожидания геолокации истекло. Попробуйте еще раз.';
                            break;
                        default:
                            errorMessage = '❌ Неизвестная ошибка геолокации.';
                            break;
                    }

                    console.error('Ошибка геолокации:', errorMessage);
                    alert(errorMessage);
                    resolve(false);
                },
                {
                    timeout: 15000, // 15 секунд
                    enableHighAccuracy: true,
                    maximumAge: 60000 // 1 минута
                }
            );
        });
    }

    static async checkAll() {
        try {
            console.log('🚀 Запуск проверки геолокации...');
            const gpsAvailable = await this.checkGPS();

            console.log('📊 Результат проверки:', {
                геолокация: gpsAvailable ? '✅ Доступна' : '❌ Недоступна'
            });

            return gpsAvailable;
        } catch (error) {
            console.error('💥 Критическая ошибка при проверке:', error);
            alert('Произошла непредвиденная ошибка при проверке геолокации.');
            return false;
        }
    }
}

export default ConnectionChecker;