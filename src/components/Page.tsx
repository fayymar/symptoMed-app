import type { PropsWithChildren } from 'react';

/**
 * Обёртка страницы. Кнопкой «Назад» Telegram управляет хук useTelegramBackButton
 * на тех страницах, где она нужна. Раньше здесь же вызывался backButton из SDK:
 * вне Telegram это бросало ошибку и приложение уходило в бесконечную перерисовку.
 */
export function Page({ children }: PropsWithChildren<{ back?: boolean }>) {
  return <>{children}</>;
}
