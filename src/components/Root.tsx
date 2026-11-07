import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <p>Что-то пошло не так. Закройте и откройте приложение заново.</p>
      <p style={{ color: '#999', fontSize: 13 }}>
        {error instanceof Error ? error.message : typeof error === 'string' ? error : ''}
      </p>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <App/>
    </ErrorBoundary>
  );
}
