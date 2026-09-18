import { useAuthState } from '@jujistu/features/auth';
import React from 'react';
import { Animated } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { AuthNavigator } from '../src/app/navigation/AuthNavigator';
import { MainNavigator } from '../src/app/navigation/MainNavigator';
import { NavigationFallback } from '../src/app/navigation/NavigationFallback';
import {
  MIN_LOADING_VISIBLE_MS,
  RootNavigator,
} from '../src/app/navigation/RootNavigator';

let mockLoadingReadyCallback: (() => void) | null = null;
let mockNavigationReadyCallback: (() => void) | null = null;
let mockDestinationReadyCallback: (() => void) | null = null;

jest.mock('@jujistu/features/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('../src/app/navigation/NavigationFallback', () => {
  const ReactModule = require('react');
  const { View: RNView } = require('react-native');
  return {
    NavigationFallback: ({ onReady }: { onReady?: () => void }) => {
      mockLoadingReadyCallback = onReady ?? null;
      return ReactModule.createElement(RNView, {
        testID: 'navigation-fallback',
      });
    },
  };
});

jest.mock('../src/app/navigation/AuthNavigator', () => {
  const ReactModule = require('react');
  const { View: RNView } = require('react-native');
  return {
    AuthNavigator: ({ onReady }: { onReady?: () => void }) => {
      mockDestinationReadyCallback = onReady ?? null;
      return ReactModule.createElement(RNView, { testID: 'auth-navigator' });
    },
  };
});

jest.mock('../src/app/navigation/MainNavigator', () => {
  const ReactModule = require('react');
  const { View: RNView } = require('react-native');
  return {
    MainNavigator: ({ onReady }: { onReady?: () => void; user: any }) => {
      mockDestinationReadyCallback = onReady ?? null;
      return ReactModule.createElement(RNView, { testID: 'main-navigator' });
    },
  };
});

jest.mock('@react-navigation/native', () => {
  const ReactModule = require('react');
  const { View: RNView } = require('react-native');
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    NavigationContainer: ({
      children,
      onReady,
    }: {
      children: React.ReactNode;
      onReady?: () => void;
    }) => {
      mockNavigationReadyCallback = onReady ?? null;
      return ReactModule.createElement(
        RNView,
        { testID: 'navigation-container' },
        children,
      );
    },
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const ReactModule = require('react');
  const { View: RNView } = require('react-native');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) =>
        ReactModule.createElement(
          RNView,
          { testID: 'stack-navigator' },
          children,
        ),
      Screen: ({ children }: { children: () => React.ReactNode }) =>
        ReactModule.createElement(
          RNView,
          { testID: 'stack-screen' },
          children(),
        ),
    }),
  };
});

describe('RootNavigator — Minimum Visible Duration & Startup Coordination', () => {
  const mockedUseAuthState = useAuthState as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockLoadingReadyCallback = null;
    mockNavigationReadyCallback = null;
    mockDestinationReadyCallback = null;
    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      user: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('exports MIN_LOADING_VISIBLE_MS as 4000ms', () => {
    expect(MIN_LOADING_VISIBLE_MS).toBe(4000);
  });

  it('1. Loading ready, auth ready ngay lập tức → vẫn phải chờ 4000ms', () => {
    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      user: null,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    // Mark loading ready, navigation ready, destination ready immediately
    act(() => {
      mockLoadingReadyCallback?.();
      mockNavigationReadyCallback?.();
      mockDestinationReadyCallback?.();
    });

    // Advance 2000ms (< 4000ms)
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Loading overlay is still mounted
    const fallback = tree.root.findAllByType(NavigationFallback);
    expect(fallback.length).toBe(1);

    act(() => tree.unmount());
  });

  it('2. Sau 3999ms → chưa được chuyển màn', () => {
    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      user: null,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    act(() => {
      mockLoadingReadyCallback?.();
      mockNavigationReadyCallback?.();
      mockDestinationReadyCallback?.();
    });

    act(() => {
      jest.advanceTimersByTime(3999);
    });

    // Loading overlay is still present at 3999ms
    const fallback = tree.root.findAllByType(NavigationFallback);
    expect(fallback.length).toBe(1);

    act(() => tree.unmount());
  });

  it('3. Sau 4000ms, mọi điều kiện ready → bắt đầu fade-out và unmount khi hoàn tất', () => {
    const timingSpy = jest.spyOn(Animated, 'timing');

    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      user: null,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    act(() => {
      mockLoadingReadyCallback?.();
      mockNavigationReadyCallback?.();
      mockDestinationReadyCallback?.();
    });

    // Before 4000ms, transition has not started
    expect(timingSpy).not.toHaveBeenCalled();

    // At 4000ms, timer elapses and fade-out transition starts
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(timingSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        duration: 240,
        toValue: 0,
        useNativeDriver: true,
      }),
    );

    // During transition (240ms), loading overlay is still mounted while fading
    const fallbackBeforeEnd = tree.root.findAllByType(NavigationFallback);
    expect(fallbackBeforeEnd.length).toBe(1);

    // Complete the 240ms transition animation
    act(() => {
      jest.advanceTimersByTime(240);
    });

    // After animation completes, loading overlay is unmounted
    const fallbackAfterEnd = tree.root.findAllByType(NavigationFallback);
    expect(fallbackAfterEnd.length).toBe(0);

    act(() => tree.unmount());
  });

  it('4. Auth chậm hơn 4000ms → tiếp tục giữ Loading', () => {
    // Auth starts as initializing
    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: true,
      user: null,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    act(() => {
      mockLoadingReadyCallback?.();
    });

    // 4000ms passes, but auth is still initializing
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Loading overlay is still mounted
    let fallback = tree.root.findAllByType(NavigationFallback);
    expect(fallback.length).toBe(1);

    // Auth completes at 5000ms
    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      user: null,
    });

    act(() => {
      tree.update(<RootNavigator />);
    });

    act(() => {
      mockNavigationReadyCallback?.();
      mockDestinationReadyCallback?.();
    });

    // Now transition runs (240ms)
    act(() => {
      jest.advanceTimersByTime(240);
    });

    fallback = tree.root.findAllByType(NavigationFallback);
    expect(fallback.length).toBe(0);

    act(() => tree.unmount());
  });

  it('5. Destination chưa ready → tiếp tục giữ Loading', () => {
    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      user: null,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    act(() => {
      mockLoadingReadyCallback?.();
      mockNavigationReadyCallback?.();
      // destinationReady is NOT called
    });

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Still keeps loading overlay because destination is not ready
    let fallback = tree.root.findAllByType(NavigationFallback);
    expect(fallback.length).toBe(1);

    // Now destination becomes ready
    act(() => {
      mockDestinationReadyCallback?.();
    });

    // Advance through 240ms transition
    act(() => {
      jest.advanceTimersByTime(240);
    });

    fallback = tree.root.findAllByType(NavigationFallback);
    expect(fallback.length).toBe(0);

    act(() => tree.unmount());
  });

  it('6. Component rerender → timer không bị reset', () => {
    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      user: null,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    act(() => {
      mockLoadingReadyCallback?.();
      mockNavigationReadyCallback?.();
      mockDestinationReadyCallback?.();
    });

    // 2000ms elapses
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Re-render component with new state/props
    act(() => {
      tree.update(<RootNavigator />);
    });

    // Advance another 2000ms (total 4000ms since loadingReady)
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Advance 240ms for transition
    act(() => {
      jest.advanceTimersByTime(240);
    });

    // If timer had been reset, it would have required 2000ms more.
    // Since it was NOT reset, loading has now completed!
    const fallback = tree.root.findAllByType(NavigationFallback);
    expect(fallback.length).toBe(0);

    act(() => tree.unmount());
  });

  it('7. Component unmount → timer được cleanup', () => {
    const clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout');

    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      user: null,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    act(() => {
      mockLoadingReadyCallback?.();
    });

    // Unmount before 4000ms
    act(() => {
      tree.unmount();
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('8. Animation bị interrupted → không được đánh dấu startup complete sai', () => {
    let animationCallback: ((result: { finished: boolean }) => void) | null =
      null;

    const compositeAnimation = {
      start: jest.fn(cb => {
        animationCallback = cb;
      }),
      stop: jest.fn(() => {
        if (animationCallback) {
          animationCallback({ finished: false });
        }
      }),
    } as unknown as Animated.CompositeAnimation;

    jest.spyOn(Animated, 'timing').mockReturnValue(compositeAnimation);

    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      user: null,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    act(() => {
      mockLoadingReadyCallback?.();
      mockNavigationReadyCallback?.();
      mockDestinationReadyCallback?.();
    });

    // Trigger timer
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(compositeAnimation.start).toHaveBeenCalled();

    // Simulate interruption before finished
    act(() => {
      compositeAnimation.stop();
    });

    // Because finished was false, startupComplete was not set to true, loading overlay remains
    const fallback = tree.root.findAllByType(NavigationFallback);
    expect(fallback.length).toBe(1);

    act(() => tree.unmount());
  });

  it('9. Authenticated user → Loading đủ thời gian rồi vào Home', () => {
    const testUser = {
      displayName: 'Champion',
      email: 'champion@jujistu.vn',
      id: 'usr-champion-1',
    };

    mockedUseAuthState.mockReturnValue({
      isAuthenticated: true,
      isInitializing: false,
      user: testUser,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    act(() => {
      mockLoadingReadyCallback?.();
      mockNavigationReadyCallback?.();
      mockDestinationReadyCallback?.();
    });

    // Advance 4000ms for timer, then 240ms for transition
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    act(() => {
      jest.advanceTimersByTime(240);
    });

    // Loading overlay is gone
    const fallback = tree.root.findAllByType(NavigationFallback);
    expect(fallback.length).toBe(0);

    // MainNavigator (Home) is mounted
    const mainNavigator = tree.root.findAllByType(MainNavigator);
    expect(mainNavigator.length).toBe(1);

    act(() => tree.unmount());
  });

  it('10. Unauthenticated user → Loading đủ thời gian rồi vào Welcome', () => {
    mockedUseAuthState.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      user: null,
    });

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<RootNavigator />);
    });

    act(() => {
      mockLoadingReadyCallback?.();
      mockNavigationReadyCallback?.();
      mockDestinationReadyCallback?.();
    });

    // Advance 4000ms for timer, then 240ms for transition
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    act(() => {
      jest.advanceTimersByTime(240);
    });

    // Loading overlay is gone
    const fallback = tree.root.findAllByType(NavigationFallback);
    expect(fallback.length).toBe(0);

    // AuthNavigator (Welcome) is mounted
    const authNavigator = tree.root.findAllByType(AuthNavigator);
    expect(authNavigator.length).toBe(1);

    act(() => tree.unmount());
  });
});
