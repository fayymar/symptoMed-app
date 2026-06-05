import { useState, useEffect } from 'react';

export const useUserId = () => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const tryGetUserId = (): boolean => {
      const tg = (window as any).Telegram?.WebApp;

      // Способ 1: Telegram WebApp initDataUnsafe
      if (tg) {
        tg.ready();
        const idFromUnsafe = tg.initDataUnsafe?.user?.id;
        if (idFromUnsafe) {
          const id = Number(idFromUnsafe);
          const prev = localStorage.getItem('symptomed_user_id');
          if (prev && prev !== String(id)) {
            localStorage.removeItem('symptomed_metrics');
            localStorage.removeItem('symptomed_metrics_setup_done');
          }
          localStorage.setItem('symptomed_user_id', String(id));
          setUserId(id);
          return true;
        }

        // Способ 2: парсинг initData строки
        const initData = tg.initData;
        if (initData) {
          try {
            const params = new URLSearchParams(initData);
            const userStr = params.get('user');
            if (userStr) {
              const user = JSON.parse(decodeURIComponent(userStr));
              if (user?.id) {
                const id = Number(user.id);
                const prev = localStorage.getItem('symptomed_user_id');
                if (prev && prev !== String(id)) {
                  localStorage.removeItem('symptomed_metrics');
                  localStorage.removeItem('symptomed_metrics_setup_done');
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
      }

      // Способ 3: localStorage (сохранённый из предыдущей сессии)
      const cached = localStorage.getItem('symptomed_user_id');
      if (cached) {
        const id = Number(cached);
        if (!isNaN(id) && id > 0) {
          setUserId(id);
          return true;
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
      return () => clearInterval(interval);
    }
  }, []);

  return userId;
};
