import type { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';

import { HomePage } from '@/pages/HomePage.tsx';
import { SymptomsPage } from '@/pages/SymptomsPage.tsx';
import { QuestionsPage } from '@/pages/QuestionsPage.tsx';
import { DurationPage } from '@/pages/DurationPage.tsx';
import { ResultPage } from '@/pages/ResultPage.tsx';
import { LoadingPage } from '@/pages/LoadingPage.tsx';
import { HealthPage } from '@/pages/HealthPage.tsx';
import { MetricHistoryPage } from '@/pages/MetricHistoryPage.tsx';
import { BloodPressurePage } from '@/pages/BloodPressurePage.tsx';
import { PulseSetupPage } from '@/pages/PulseSetupPage.tsx';

const RedirectToHeartrate = () => <Navigate to="/metrics/heartrate" replace />;
const RedirectToHealth = () => <Navigate to="/health" replace />;

interface Route {
  path: string;
  Component: ComponentType;
}

export const routes: Route[] = [
  { path: '/', Component: HomePage },
  { path: '/symptoms', Component: SymptomsPage },
  { path: '/questions', Component: QuestionsPage },
  { path: '/duration', Component: DurationPage },
  { path: '/result', Component: ResultPage },
  { path: '/loading', Component: LoadingPage },
  { path: '/health', Component: HealthPage },
  { path: '/metrics/blood-pressure', Component: BloodPressurePage },
  { path: '/metrics/:type', Component: MetricHistoryPage },
  { path: '/pulse-setup', Component: PulseSetupPage },
  { path: '/heartrate', Component: RedirectToHeartrate },
  { path: '/pulse', Component: RedirectToHealth },
];
