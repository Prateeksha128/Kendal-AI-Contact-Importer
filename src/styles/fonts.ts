// Font utility classes for consistent typography
export const fontClasses = {
  // Geist Variable (default sans-serif)
  sans: 'font-sans', // Uses --font-geist-sans
  mono: 'font-mono', // Uses --font-geist-mono
  
  // Font weights
  light: 'font-light',     // 300
  normal: 'font-normal',   // 400
  medium: 'font-medium',   // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',       // 700
  
  // Text sizes with Geist Variable
  xs: 'text-xs font-sans',
  sm: 'text-sm font-sans', 
  base: 'text-base font-sans',
  lg: 'text-lg font-sans',
  xl: 'text-xl font-sans',
  '2xl': 'text-2xl font-sans',
  '3xl': 'text-3xl font-sans',
  
  // Common combinations
  heading: 'font-sans font-semibold',
  subheading: 'font-sans font-medium',
  body: 'font-sans font-normal',
  caption: 'font-sans font-light text-sm',
} as const;
