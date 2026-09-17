export const ROOT_ROUTES = {
  AUTH: 'Auth',
  MAIN: 'Main',
} as const;

export const AUTH_ROUTES = {
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  OTP: 'Otp',
} as const;

export const MAIN_ROUTES = {
  HOME: 'Home',
} as const;

export type RootRouteName = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];
export type AuthRouteName = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type MainRouteName = (typeof MAIN_ROUTES)[keyof typeof MAIN_ROUTES];
