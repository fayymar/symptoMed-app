import { lazy, type ComponentType, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load всех страниц — загружаются только когда нужны
const HomePage        = lazy(() => import('@/pages/HomePage.tsx').then(m => ({ default: m.HomePage })));
const SymptomsPage    = lazy(() => import('@/pages/SymptomsPage.tsx').then(m => ({ default: m.SymptomsPage })));
const QuestionsPage   = lazy(() => import('@/pages/QuestionsPage.tsx').then(m => ({ default: m.QuestionsPage })));
const DurationPage    = lazy(() => import('@/pages/DurationPage.tsx').then(m => ({ default: m.DurationPage })));
const ResultPage      = lazy(() => import('@/pages/ResultPage.tsx').then(m => ({ default: m.ResultPage })));
const LoadingPage     = lazy(() => import('@/pages/LoadingPage.tsx').then(m => ({ default: m.LoadingPage })));
const HealthPage      = lazy(() => import('@/pages/HealthPage.tsx').then(m => ({ default: m.HealthPage })));
const MetricHistoryPage = lazy(() => import('@/pages/MetricHistoryPage.tsx').then(m => ({ default: m.MetricHistoryPage })));
const BloodPressurePage = lazy(() => import('@/pages/BloodPressurePage.tsx').then(m => ({ default: m.BloodPressurePage })));
const PulseSetupPage  = lazy(() => import('@/pages/PulseSetupPage.tsx').then(m => ({ default: m.PulseSetupPage })));
const ProfilePage     = lazy(() => import('@/pages/ProfilePage.tsx').then(m => ({ default: m.ProfilePage })));
const MetricsSetupPage = lazy(() => import('@/pages/MetricsSetupPage.tsx').then(m => ({ default: m.MetricsSetupPage })));
const HistoryPage     = lazy(() => import('@/pages/HistoryPage.tsx').then(m => ({ default: m.HistoryPage })));
const ClinicsPage     = lazy(() => import('@/pages/ClinicsPage.tsx').then(m => ({ default: m.ClinicsPage })));
const HelpPage        = lazy(() => import('@/pages/HelpPage.tsx').then(m => ({ default: m.HelpPage })));
const MedicalHistoryPage = lazy(() => import('@/pages/MedicalHistoryPage.tsx').then(m => ({ default: m.MedicalHistoryPage })));

const RedirectToHeartrate = () => <Navigate to="/metrics/heartrate" replace />;
const RedirectToHealth    = () => <Navigate to="/health" replace />;

// Обёртка с Suspense для плавной загрузки
const withSuspense = (Component: ComponentType): ComponentType => {
  return function SuspenseWrapper(props) {
    return (
      <Suspense fallback={
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', color: 'var(--tg-theme-hint-color, #999)', fontSize: 14,
        }}>
          Загрузка...
        </div>
      }>
        <Component {...props} />
      </Suspense>
    );
  };
};

interface Route {
  path: string;
  Component: ComponentType;
}

export const routes: Route[] = [
  { path: '/',                      Component: withSuspense(HomePage) },
  { path: '/symptoms',              Component: withSuspense(SymptomsPage) },
  { path: '/questions',             Component: withSuspense(QuestionsPage) },
  { path: '/duration',              Component: withSuspense(DurationPage) },
  { path: '/result',                Component: withSuspense(ResultPage) },
  { path: '/loading',               Component: withSuspense(LoadingPage) },
  { path: '/health',                Component: withSuspense(HealthPage) },
  { path: '/metrics/blood-pressure',Component: withSuspense(BloodPressurePage) },
  { path: '/metrics/:type',         Component: withSuspense(MetricHistoryPage) },
  { path: '/pulse-setup',           Component: withSuspense(PulseSetupPage) },
  { path: '/profile',               Component: withSuspense(ProfilePage) },
  { path: '/metrics-setup',         Component: withSuspense(MetricsSetupPage) },
  { path: '/history',               Component: withSuspense(HistoryPage) },
  { path: '/clinics',               Component: withSuspense(ClinicsPage) },
  { path: '/help',                  Component: withSuspense(HelpPage) },
  { path: '/medical-history',       Component: withSuspense(MedicalHistoryPage) },
  { path: '/heartrate',             Component: RedirectToHeartrate },
  { path: '/pulse',                 Component: RedirectToHealth },
];
