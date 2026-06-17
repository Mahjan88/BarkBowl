import { Platform } from 'react-native'

export const COLORS = {
  primary:       '#0d9488',
  primaryLight:  '#ccfbf1',
  primaryDark:   '#0f766e',
  amber:         '#d97706',
  barkLight:     '#faefd9',
  background:    '#fafaf9',
  card:          '#ffffff',
  textPrimary:   '#1c1917',
  textSecondary: '#78716c',
  border:        '#e7e5e4',
  white:         '#ffffff',
  error:         '#dc2626',
  success:       '#16a34a',
  warning:       '#d97706',
}

export const FONTS = {
  sizes: {
    xs:   11,
    sm:   13,
    md:   15,
    lg:   17,
    xl:   20,
    xxl:  24,
    xxxl: 30,
  },
  weights: {
    regular:    '400',
    medium:     '500',
    semibold:   '600',
    bold:       '700',
    extrabold:  '800',
  },
}

export const RADIUS = {
  sm:  6,
  md:  10,
  lg:  16,
  xl:  24,
  full: 999,
}

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  xxxl: 32,
}

export const shadow = (elevation = 2) => ({
  ...Platform.select({
    ios: {
      shadowColor:   '#000',
      shadowOffset:  { width: 0, height: elevation },
      shadowOpacity: 0.08 + elevation * 0.02,
      shadowRadius:  elevation * 2,
    },
    android: {
      elevation,
    },
  }),
})
