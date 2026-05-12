import { useState, useEffect } from 'react';

export const useUserId = () => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const tryGetUserId = () => {
      const tg = (window as any).Telegram?.WebApp;
      if (!tg) return false;

      tg.ready();

      // Способ 1: initDataUnsafe (работает на большинстве устройств)
      const idFromUnsafe = tg.initDataUnsafe?.user?.id;
      if (idFromUnsafe) {
        const id = Number(idFromUnsafe);
        const prevUserId = localStorage.getItem('symptomed_user_id');
        if (prevUserId && prevUserId !== String(id)) {
          localStorage.removeItem('symptomed_metrics');
          localStorage.removeItem('symptomed_metrics_setup_done');
          console.log('New user detected, cleared previous user data');
        }
        localStorage.setItem('symptomed_user_id', String(id));
        setUserId(id);
        return true;
      }

      // Способ 2: парсинг initData строки (более надёжный)
      const initData = tg.initData;
      if (initData) {
        try {
          const params = new URLSearchParams(initData);
          const userStr = params.get('user');
          if (userStr) {
            const user = JSON.parse(decodeURIComponent(userStr));
            if (user?.id) {
              const id = Number(user.id);
              const prevUserId = localStorage.getItem('symptomed_user_id');
              if (prevUserId && prevUserId !== String(id)) {
                localStorage.removeItem('symptomed_metrics');
                localStorage.removeItem('symptomed_metrics_setup_done');
                console.log('New user detected, cleared previous user data');
              }
              localStorage.setItem('symptomed_user_id', String(id));
              setUserId(id);
              return true;
            }
          }
        } catch (e) {
          console.error('Failed to parse initData:', e);
        }
      }

      return false;
    };

    if (!tryGetUserId()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (tryGetUserId() || attempts >= 10) {
          clearInterval(interval);
        }
      }, 500);
    }
  }, []);

  return userId;
};
