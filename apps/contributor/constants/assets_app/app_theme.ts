const AppColors = {
  primary: '#FFB800',
  primaryDark: '#2E2E2E',
  secondary: '#FF3D00',
  background: '#000000',
  text: '#FFFFFF',
  white: '#ffffff',
  success: '#4caf50',
  error: '#f44336',
  disable: '#777',

  //Gradient
  gradientPrimary: 'linear-gradient(90deg, #FFB800 3.87%, #FF3D00 100%)',
}

const AppSpace = (factor: number) => `${factor * 8}px`

const AppFont = {
  small: '12px',
  medium: '16px',
  large: '20px',
  extraLarge: '24px',
  s60: '60px',
  s35: '35px',
}

export { AppColors, AppSpace, AppFont }
