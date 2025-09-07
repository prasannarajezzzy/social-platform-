// Pivota Theme Configuration
// JavaScript version of theme colors for programmatic access

export const colors = {
  // Primary Colors
  electricBlue: '#0066FF',
  darkCharcoal: '#2C2C2C',
  white: '#FFFFFF',

  // Secondary Colors
  vibrantCoral: '#FF6B6B',
  softTeal: '#4ECDC4',

  // Neutral Tones
  lightGray: '#F5F5F5',
  mutedGold: '#D4AF37',

  // Accent Colors
  sunsetOrange: '#FF8C42',
  lightSkyBlue: '#87CEEB',
};

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.electricBlue} 0%, ${colors.lightSkyBlue} 100%)`,
  coral: `linear-gradient(135deg, ${colors.vibrantCoral} 0%, ${colors.sunsetOrange} 100%)`,
  teal: `linear-gradient(135deg, ${colors.softTeal} 0%, ${colors.lightSkyBlue} 100%)`,
  gold: `linear-gradient(135deg, ${colors.mutedGold} 0%, ${colors.sunsetOrange} 100%)`,
};

export const semantic = {
  success: {
    color: colors.softTeal,
    background: `rgba(78, 205, 196, 0.1)`,
    border: colors.softTeal,
  },
  error: {
    color: colors.vibrantCoral,
    background: `rgba(255, 107, 107, 0.1)`,
    border: colors.vibrantCoral,
  },
  warning: {
    color: colors.sunsetOrange,
    background: `rgba(255, 140, 66, 0.1)`,
    border: colors.sunsetOrange,
  },
  info: {
    color: colors.electricBlue,
    background: `rgba(0, 102, 255, 0.1)`,
    border: colors.electricBlue,
  },
};

export const text = {
  primary: colors.darkCharcoal,
  secondary: colors.darkCharcoal,
  muted: colors.darkCharcoal,
  disabled: colors.darkCharcoal,
  inverse: colors.white,
  link: colors.electricBlue,
  linkHover: colors.lightSkyBlue,
};

export const background = {
  primary: colors.white,
  secondary: colors.lightGray,
  tertiary: colors.darkCharcoal,
  overlay: 'rgba(44, 44, 44, 0.5)',
  glass: 'rgba(255, 255, 255, 0.1)',
};

export const border = {
  primary: colors.lightGray,
  secondary: colors.electricBlue,
  accent: colors.softTeal,
  error: colors.vibrantCoral,
  success: colors.softTeal,
};

export const shadow = {
  light: 'rgba(44, 44, 44, 0.1)',
  medium: 'rgba(44, 44, 44, 0.15)',
  heavy: 'rgba(44, 44, 44, 0.25)',
  colored: 'rgba(0, 102, 255, 0.3)',
};

// Utility function to get CSS custom property
export const getCSSVar = (property) => {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${property}`).trim();
  }
  return null;
};

// Utility function to set CSS custom property
export const setCSSVar = (property, value) => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(`--${property}`, value);
  }
};

// Theme object for easy access
export const theme = {
  colors,
  gradients,
  semantic,
  text,
  background,
  border,
  shadow,
  getCSSVar,
  setCSSVar,
};

export default theme;
