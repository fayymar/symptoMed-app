import type { ComponentType } from 'react';

import { HomePage } from '@/pages/HomePage.tsx';
import { SymptomsPage } from '@/pages/SymptomsPage.tsx';
import { QuestionsPage } from '@/pages/QuestionsPage.tsx';
import { DurationPage } from '@/pages/DurationPage.tsx';
import { ResultPage } from '@/pages/ResultPage.tsx';
import { LoadingPage } from '@/pages/LoadingPage.tsx';
import { HeartratePage } from '@/pages/HeartratePage.tsx';

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
  { path: '/heartrate', Component: HeartratePage },
];
