export const theme = {
  colors: {
    background: '#F7FBFF',
    surface: '#FFFFFF',
    primary: '#3B82F6',
    primaryPressed: '#2563EB',
    text: '#0F172A',
    textMuted: '#475569',
    border: '#DCEBFF',
    success: '#22C55E',
    warning: '#F59E0B',
  },
  spacing: {
    xs: 6,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 20,
    pill: 999,
  },
  typography: {
    body: 17,
    heading: 26,
    subheading: 20,
    caption: 14,
    button: 18,
  },
  shadow: {
    card: {
      shadowColor: '#0F172A',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 5 },
      elevation: 3,
    },
  },
} as const;
