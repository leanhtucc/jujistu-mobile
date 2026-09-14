import {
  AUTH_ROUTES,
  MAIN_ROUTES,
  ROOT_ROUTES,
} from '@jujistu/app/navigation/routes';
import type {
  AuthStackParamList,
  MainStackParamList,
  RootStackParamList,
} from '@jujistu/app/navigation/types';

describe('navigation contract', () => {
  it('defines stable root route names for auth and main navigators', () => {
    const authRoute: keyof RootStackParamList = ROOT_ROUTES.AUTH;
    const mainRoute: keyof RootStackParamList = ROOT_ROUTES.MAIN;

    expect(authRoute).toBe('Auth');
    expect(mainRoute).toBe('Main');
    expect(Object.values(ROOT_ROUTES)).toEqual(['Auth', 'Main']);
  });

  it('defines stable auth route names', () => {
    const loginRoute: keyof AuthStackParamList = AUTH_ROUTES.LOGIN;
    const registerRoute: keyof AuthStackParamList = AUTH_ROUTES.REGISTER;

    expect(loginRoute).toBe('Login');
    expect(registerRoute).toBe('Register');
    expect(Object.values(AUTH_ROUTES)).toEqual(['Login', 'Register']);
  });

  it('defines stable main route names', () => {
    const homeRoute: keyof MainStackParamList = MAIN_ROUTES.HOME;

    expect(homeRoute).toBe('Home');
    expect(Object.values(MAIN_ROUTES)).toEqual(['Home']);
  });
});
