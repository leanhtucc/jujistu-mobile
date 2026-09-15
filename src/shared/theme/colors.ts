import { semanticColors } from './semantic/colors';

export const lightColors = {
  background: '#FFFFFF',
  surface: '#F3F4F6',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#2563EB',
  error: '#DC2626',
} as const;

export const darkColors = {
  background: semanticColors.background.canvas,
  surface: semanticColors.background.surface,
  text: semanticColors.text.primary,
  textSecondary: semanticColors.text.secondary,
  border: semanticColors.border.default,
  primary: semanticColors.action.primary,
  error: semanticColors.status.error,
} as const;
