import { ROOT_ROUTES } from './routes';

export type RootStackParamList = {
  [ROOT_ROUTES.HOME]: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
