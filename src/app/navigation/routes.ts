export const ROOT_ROUTES = {
  HOME: 'Home',
} as const;

export type RootRouteName = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];
