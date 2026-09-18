import { HomeRouteScreen } from '@jujistu/app/screens/HomeRouteScreen';
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Image, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 843 },
  insets: { top: 44, right: 0, bottom: 20, left: 0 },
};

describe('HomeRouteScreen', () => {
  it('composes account header, home content, background and bottom navigation', () => {
    let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;

    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeRouteScreen
            user={{
              id: 'home-user',
              email: 'athlete@example.com',
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

    const tabs = tree!.root.findAll(
      node => node.props.accessibilityRole === 'tab',
    );
    expect(
      Array.from(new Set(tabs.map(tab => tab.props.accessibilityLabel))),
    ).toEqual(['Trang chủ', 'Shop', 'Giải đấu', 'Nhiệm vụ', 'Bạn bè']);
    const selectedHomeTab = tabs.find(
      tab =>
        tab.props.accessibilityLabel === 'Trang chủ' &&
        tab.props.accessibilityState?.selected,
    );
    expect(selectedHomeTab).toBeDefined();

    const imageSources = tree!.root
      .findAllByType(Image)
      .map(node => node.props.source);

    expect(imageSources).toEqual(
      expect.arrayContaining([
        require('../assets/image/backgrounds/bg_home.png'),
        require('../assets/app/LogoApp.png'),
      ]),
    );
  });
});
