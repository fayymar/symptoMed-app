import React from 'react';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { useLaunchParams, useSignal, miniApp } from '@tma.js/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { routes } from '@/navigation/routes.tsx';

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {routes.map((route) => <Route key={route.path} {...route} />)}
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </HashRouter>
  );
}

function TelegramApp() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <AppRouter />
    </AppRoot>
  );
}

function FallbackApp() {
  return (
    <AppRoot appearance="light" platform="base">
      <AppRouter />
    </AppRoot>
  );
}

interface SDKErrorBoundaryState {
  hasError: boolean;
}

class SDKErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  SDKErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SDKErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function App() {
  return (
    <SDKErrorBoundary fallback={<FallbackApp />}>
      <TelegramApp />
    </SDKErrorBoundary>
  );
}
