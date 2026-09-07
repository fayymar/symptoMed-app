// Минимальные типы для window.Telegram.WebApp — только та часть API,
// которая реально используется в проекте напрямую (в обход @tma.js/sdk-react).
// Полная спецификация: https://core.telegram.org/bots/webapps#initializing-mini-apps

export interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface TelegramWebAppLocationData {
  latitude: number;
  longitude: number;
}

export interface TelegramWebAppBackButton {
  show(): void;
  hide(): void;
  onClick(handler: () => void): void;
  offClick(handler: () => void): void;
}

export interface TelegramWebApp {
  ready(): void;
  expand(): void;
  platform: string;
  initData: string;
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
  BackButton: TelegramWebAppBackButton;
  requestLocation?(callback: (location: TelegramWebAppLocationData | null) => void): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export {};
