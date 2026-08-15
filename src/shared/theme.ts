import { useColorScheme } from 'react-native';

const light = {
  background: '#F4F6F8',
  surface: '#FFFFFF',
  border: '#E1E5EA',
  text: '#161B22',
  textMuted: '#5B6472',
  primary: '#2563EB',
  danger: '#DC2626',
  warning: '#D97706',
  severe: '#B91C1C',
};

const dark = {
  background: '#0B0F14',
  surface: '#151B23',
  border: '#262E38',
  text: '#EDEFF2',
  textMuted: '#9AA4B2',
  primary: '#5B8DEF',
  danger: '#F87171',
  warning: '#FBBF24',
  severe: '#F87171',
};

export type ThemeColors = typeof light;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radii = { sm: 6, md: 10, lg: 16, pill: 999 };

export const colors = light;

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}
