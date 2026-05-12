import type React from 'react';

export const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  marginBottom: '10px',
  backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
  color: 'var(--tg-theme-button-text-color, #ffffff)',
  border: 'none',
  borderRadius: '12px',
  padding: '14px 16px',
  fontSize: '16px',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};
