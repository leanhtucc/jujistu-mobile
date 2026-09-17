import type { NavigatorScreenParams } from '@react-navigation/native';

import { AUTH_ROUTES, MAIN_ROUTES, ROOT_ROUTES } from './routes';

export type AuthStackParamList = {
  [AUTH_ROUTES.WELCOME]: undefined;
  [AUTH_ROUTES.LOGIN]: undefined;
  [AUTH_ROUTES.OTP]: {
    challengeId: string;
    email: string;
  };
};

export type MainStackParamList = {
  [MAIN_ROUTES.HOME]: undefined;
};

export type RootStackParamList = {
  [ROOT_ROUTES.AUTH]: NavigatorScreenParams<AuthStackParamList> | undefined;
  [ROOT_ROUTES.MAIN]: NavigatorScreenParams<MainStackParamList> | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
