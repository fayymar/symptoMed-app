import { createContext, useContext, useState, type FC, type ReactNode } from 'react';
import type { Question, Specialist } from '@/api/consultation.ts';

export interface ResultData {
  urgency: string;
  recommendation: string;
  specialists: Specialist[];
  needs_fresh_metrics: string[];
}

interface ConsultationState {
  sessionId: string;
  symptoms: string;
  questions: Question[];
  answers: string[];
  duration: string;
  anamnesisQuestions: Question[];
  anamnesisAnswers: string[];
  redFlag: boolean;
  needsFreshMetrics: string[];
  result: ResultData | null;
}

interface ConsultationContextValue extends ConsultationState {
  setSessionData: (sessionId: string, questions: Question[], redFlag: boolean, needsFreshMetrics: string[]) => void;
  setSymptoms: (symptoms: string) => void;
  setAnswer: (index: number, answer: string) => void;
  setDuration: (duration: string) => void;
  setAnamnesisData: (questions: Question[]) => void;
  setAnamnesisAnswer: (index: number, answer: string) => void;
  setResult: (result: ResultData) => void;
  reset: () => void;
}

const defaultState: ConsultationState = {
  sessionId: '',
  symptoms: '',
  questions: [],
  answers: [],
  duration: '',
  anamnesisQuestions: [],
  anamnesisAnswers: [],
  redFlag: false,
  needsFreshMetrics: [],
  result: null,
};

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export const ConsultationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ConsultationState>(defaultState);

  const setSessionData = (
    sessionId: string,
    questions: Question[],
    redFlag: boolean,
    needsFreshMetrics: string[],
  ) => setState((s) => ({ ...s, sessionId, questions, answers: [], redFlag, needsFreshMetrics }));

  const setSymptoms = (symptoms: string) => setState((s) => ({ ...s, symptoms }));

  const setAnswer = (index: number, answer: string) =>
    setState((s) => {
      const answers = [...s.answers];
      answers[index] = answer;
      return { ...s, answers };
    });

  const setDuration = (duration: string) => setState((s) => ({ ...s, duration }));

  const setAnamnesisData = (anamnesisQuestions: Question[]) =>
    setState((s) => ({ ...s, anamnesisQuestions, anamnesisAnswers: [] }));

  const setAnamnesisAnswer = (index: number, answer: string) =>
    setState((s) => {
      const anamnesisAnswers = [...s.anamnesisAnswers];
      anamnesisAnswers[index] = answer;
      return { ...s, anamnesisAnswers };
    });

  const setResult = (result: ResultData) => setState((s) => ({ ...s, result }));

  const reset = () => setState(defaultState);

  return (
    <ConsultationContext.Provider
      value={{ ...state, setSessionData, setSymptoms, setAnswer, setDuration, setAnamnesisData, setAnamnesisAnswer, setResult, reset }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export function useConsultation(): ConsultationContextValue {
  const ctx = useContext(ConsultationContext);
  if (!ctx) throw new Error('useConsultation must be used within ConsultationProvider');
  return ctx;
}
