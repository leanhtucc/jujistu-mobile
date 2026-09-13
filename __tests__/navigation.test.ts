import { ROOT_ROUTES } from '@jujistu/app/navigation/routes';
import type { RootStackParamList } from '@jujistu/app/navigation/types';

describe('root navigation contract', () => {
  it('uses one stable route name for the current home feature', () => {
    const initialRoute: keyof RootStackParamList = ROOT_ROUTES.HOME;

    expect(initialRoute).toBe('Home');
    expect(Object.values(ROOT_ROUTES)).toEqual(['Home']);
  });
});
