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
  [MAIN_ROUTES.SHOP]: undefined;
  [MAIN_ROUTES.TOURNAMENTS]: undefined;
  [MAIN_ROUTES.TOURNAMENT_DETAIL]: {
    tournamentId: string;
    initialTab?: 'Lịch thi đấu' | 'Kết quả' | 'Tổng sắp' | 'Nhánh đấu';
  };
  [MAIN_ROUTES.ATHLETES]: undefined;
  [MAIN_ROUTES.ATHLETE_JOURNEY]: {
    athleteId?: string;
  };
  [MAIN_ROUTES.MISSIONS]: undefined;
  [MAIN_ROUTES.TICKETS]: {
    tournamentId?: string;
    /** Stand preselected when opened from a shop ticket product. */
    zone?: 'vip' | 'a';
  };
  [MAIN_ROUTES.MY_TICKETS]: undefined;
  [MAIN_ROUTES.VIDEOS]: undefined;
  [MAIN_ROUTES.VIDEO_PLAYER]: {
    videoId: string;
  };
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
