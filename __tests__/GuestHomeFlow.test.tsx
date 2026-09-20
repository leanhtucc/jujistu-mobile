import { HomeScreen } from '@jujistu/features/home';
import { GuestAccountHeader } from '@jujistu/features/home/components/GuestAccountHeader';
import { HomeHeroCarousel } from '../src/features/home/components/HomeHeroCarousel';
import { ProductAccountHeader } from '@jujistu/features/home/components/ProductAccountHeader';
import { getHomeQuickActions } from '@jujistu/features/home/data/home-content';
import { useRequireAuth } from '../src/app/navigation/use-require-auth';
import { tokenManager } from '../src/shared/services/api/token-manager';
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 843 },
  insets: { top: 44, right: 0, bottom: 20, left: 0 },
};

jest.mock('@jujistu/features/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('GuestHomeFlow — Complete Guest Home & Auth Flow', () => {
  it('TEST-GUEST-01: renders HomeScreen in guest mode when user is null', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen user={null} />
        </SafeAreaProvider>,
      );
    });

    const guestHeaders = tree.root.findAllByType(GuestAccountHeader);
    const productHeaders = tree.root.findAllByType(ProductAccountHeader);

    expect(guestHeaders.length).toBe(1);
    expect(productHeaders.length).toBe(0);

    act(() => tree.unmount());
  });

  it('TEST-GUEST-03 & 04: GuestAccountHeader renders welcome message and login button', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen user={null} />
        </SafeAreaProvider>,
      );
    });

    const texts = tree.root
      .findAllByType(Text)
      .map(t => t.props.children)
      .filter(v => typeof v === 'string');

    expect(texts).toContain('Chào mừng đến với VIMMA!');
    expect(texts).toContain('Đăng nhập');

    act(() => tree.unmount());
  });

  it('TEST-GUEST-05: Tap Đăng nhập on GuestAccountHeader invokes onLogin callback', () => {
    const handleLogin = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen onLogin={handleLogin} user={null} />
        </SafeAreaProvider>,
      );
    });

    const guestHeader = tree.root.findByType(GuestAccountHeader);
    act(() => {
      guestHeader.props.onLogin?.();
    });

    expect(handleLogin).toHaveBeenCalledTimes(1);
    act(() => tree.unmount());
  });

  it('TEST-GUEST-07: Hero Carousel renders in guest mode', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen user={null} />
        </SafeAreaProvider>,
      );
    });

    const heroCarousel = tree.root.findAllByType(HomeHeroCarousel);
    expect(heroCarousel.length).toBe(1);

    act(() => tree.unmount());
  });

  it('TEST-GUEST-08: News Section renders in guest mode', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen user={null} />
        </SafeAreaProvider>,
      );
    });

    const texts = tree.root
      .findAllByType(Text)
      .map(t => t.props.children)
      .filter(v => typeof v === 'string');

    expect(texts).toContain('Tin tức & Sự kiện');
    expect(texts).toContain(
      'Bước lùi này không khiến cho Trần Quốc Tuấn lệch hướng',
    );

    act(() => tree.unmount());
  });

  it('TEST-GUEST-09 & 10: Quick action item 3 is Coming Soon in guest mode', () => {
    const guestActions = getHomeQuickActions('guest');
    expect(guestActions.left[2]).toEqual({
      key: 'mma-academy',
      label: 'Coming Soon',
      icon: 'mmaAcademy',
      iconSize: 34,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen user={null} />
        </SafeAreaProvider>,
      );
    });

    const texts = tree.root
      .findAllByType(Text)
      .map(t => t.props.children)
      .filter(v => typeof v === 'string');

    expect(texts).toContain('Coming Soon');
    expect(texts).not.toContain('Học viện MMA');

    act(() => tree.unmount());
  });

  it('TEST-GUEST-11: Quick action item 3 is Học viện MMA in authenticated mode', () => {
    const authActions = getHomeQuickActions('authenticated');
    expect(authActions.left[2]).toEqual({
      key: 'mma-academy',
      label: 'Học viện MMA',
      icon: 'mmaAcademy',
      iconSize: 34,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen user={{ displayName: 'Võ sĩ VIMMA', avatarUrl: null }} />
        </SafeAreaProvider>,
      );
    });

    const texts = tree.root
      .findAllByType(Text)
      .map(t => t.props.children)
      .filter(v => typeof v === 'string');

    expect(texts).toContain('Học viện MMA');
    expect(texts).not.toContain('Coming Soon');

    act(() => tree.unmount());
  });

  it('TEST-GUEST-13: useRequireAuth redirects guest to Login screen when accessing protected actions', () => {
    const { useAuthState } = require('@jujistu/features/auth');
    const { useNavigation } = require('@react-navigation/native');

    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useAuthState as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    let guardResult: ReturnType<typeof useRequireAuth> | null = null;
    function TestConsumer() {
      guardResult = useRequireAuth();
      return null;
    }

    act(() => {
      ReactTestRenderer.create(<TestConsumer />);
    });

    const mockProtectedAction = jest.fn();
    const allowed = guardResult!.requireAuth(mockProtectedAction);

    expect(allowed).toBe(false);
    expect(mockProtectedAction).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('Auth', { screen: 'Login' });
  });

  it('TEST-GUEST-14 & 16: Authenticated mode displays ProductAccountHeader with user info', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen
            user={{
              displayName: 'Nguyễn Văn A',
              avatarUrl: 'https://example.test/avatar.png',
            }}
          />
        </SafeAreaProvider>,
      );
    });

    const productHeaders = tree.root.findAllByType(ProductAccountHeader);
    const guestHeaders = tree.root.findAllByType(GuestAccountHeader);

    expect(productHeaders.length).toBe(1);
    expect(guestHeaders.length).toBe(0);
    expect(productHeaders[0].props.username).toBe('Nguyễn Văn A');

    act(() => tree.unmount());
  });

  it('TEST-GUEST-17: Switching from authenticated to null switches back to GuestAccountHeader', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen
            user={{
              displayName: 'Nguyễn Văn A',
              avatarUrl: null,
            }}
          />
        </SafeAreaProvider>,
      );
    });

    expect(tree.root.findAllByType(ProductAccountHeader).length).toBe(1);
    expect(tree.root.findAllByType(GuestAccountHeader).length).toBe(0);

    // Simulate logout (user -> null)
    act(() => {
      tree.update(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen user={null} />
        </SafeAreaProvider>,
      );
    });

    expect(tree.root.findAllByType(ProductAccountHeader).length).toBe(0);
    expect(tree.root.findAllByType(GuestAccountHeader).length).toBe(1);

    act(() => tree.unmount());
  });

  it('TEST-GUEST-19: Token storage is NOT touched for guest operations', async () => {
    const getTokensSpy = jest.spyOn(tokenManager, 'getTokens');
    const saveTokensSpy = jest.spyOn(tokenManager, 'saveTokens');

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen user={null} />
        </SafeAreaProvider>,
      );
    });

    // Guest operations do not save any tokens
    expect(saveTokensSpy).not.toHaveBeenCalled();

    act(() => tree.unmount());
    getTokensSpy.mockRestore();
    saveTokensSpy.mockRestore();
  });
});
