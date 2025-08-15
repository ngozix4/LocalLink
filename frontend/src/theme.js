export default {
  // Colors
  colors: {
    primary: '#4A90E2',       // Main brand color (blue)
    primaryDark: '#2A70C2',    // Darker shade of primary
    primaryLight: '#6AB0F2',   // Lighter shade of primary
    
    secondary: '#FFA726',      // Secondary brand color (orange)
    secondaryDark: '#E68A00',  // Darker shade of secondary
    secondaryLight: '#FFC266', // Lighter shade of secondary
    
    success: '#4CAF50',        // Success messages
    warning: '#FFC107',        // Warning messages
    danger: '#F44336',         // Error/danger messages
    info: '#2196F3',           // Info messages
    
    white: '#FFFFFF',
    black: '#000000',
    gray100: '#F5F5F5',        // Very light gray
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    
    text: '#333333',           // Primary text color
    textSecondary: '#666666',  // Secondary text color
    textTertiary: '#999999',   // Tertiary text color
    
    background: '#FFFFFF',     // Main background
    cardBackground: '#FFFFFF', // Card/component background
  },
  
  // Typography
  fonts: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    light: 'Roboto-Light',
  },
  
  fontSizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    small: 14,
    tiny: 12,
  },
  
  // Spacing
  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  
  // Borders
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 100,
  },
  
  borderWidth: {
    none: 0,
    thin: 1,
    thick: 2,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
  },
  
  // Animation
  animation: {
    scale: 1.0,
    timing: {
      quick: 150,
      normal: 300,
      slow: 500,
    },
  },
};