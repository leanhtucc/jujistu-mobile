import { HomeScreen } from '@jujistu/features/home';
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Image, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 843 },
  insets: { top: 44, right: 0, bottom: 20, left: 0 },
};

describe('HomeScreen composition', () => {
  it('composes the account header, Home content and background', () => {
    let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;

    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen
            user={{
              displayName: 'Mardust Vuong',
              avatarUrl: null,
            }}
          />
        </SafeAreaProvider>,
      );
    });

    const text = tree!.root
      .findAllByType(Text)
      .map(node => node.props.children)
      .filter(value => typeof value === 'string');

    expect(text).toEqual(
      expect.arrayContaining([
        'Mardust Vuong',
        'Level 22',
        '6253',
        '8888',
        'Tin tức & Sự kiện',
      ]),
    );

    const imageSources = tree!.root
      .findAllByType(Image)
      .map(node => node.props.source);

    expect(imageSources).toEqual(
      expect.arrayContaining([
        require('../assets/image/backgrounds/bg_home.png'),
        require('../assets/image/avatars/avatar_default.png'),
      ]),
    );

    act(() => {
      tree!.unmount();
    });
  });

  it('reports ready only after layout, background and initial hero settle', () => {
    const onReady = jest.fn();
    let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;

    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen
            onReady={onReady}
            user={{ displayName: 'Mardust Vuong', avatarUrl: null }}
          />
        </SafeAreaProvider>,
      );
    });

    const rootLayout = tree!.root
      .findAllByType(View)
      .find(node => typeof node.props.onLayout === 'function')!;
    const images = tree!.root.findAllByType(Image);
    const background = images.find(
      image =>
        image.props.source ===
        require('../assets/image/backgrounds/bg_home.png'),
    )!;
    const initialHero = images.find(
      image =>
        image.props.source ===
          require('../assets/image/banners/banner_home_02.png') &&
        typeof image.props.onLoad === 'function',
    )!;

    act(() => {
      rootLayout.props.onLayout();
      background.props.onLoad();
    });
    expect(onReady).not.toHaveBeenCalled();

    act(() => {
      initialHero.props.onLoad();
    });
    expect(onReady).toHaveBeenCalledTimes(1);

    act(() => {
      tree!.unmount();
    });
  });
});
