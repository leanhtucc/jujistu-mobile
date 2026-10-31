import { HomeScreen } from '@jujistu/features/home';
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Image, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 843 },
  insets: { top: 44, right: 0, bottom: 20, left: 0 },
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the Figma home content with local assets', () => {
    let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;

    act(() => {
      tree = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={metrics}>
          <HomeScreen
            user={{ displayName: 'Mardust Vuong', avatarUrl: null }}
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
        'THỨ TƯ · 07/10',
        '12.500',
        'Lịch giải',
        'Kết quả',
        'Vé',
        'Video',
        'CLB',
        'GIẢI TIẾP THEO · MỞ RỘNG',
        'Cúp Jujitsu Hà Nội mở rộng 2026',
        'Giải vô địch Jujitsu Quốc gia 2026',
        'Gi Sen Vàng Pro đã lên kệ',
        'Vé vào sân',
        'Phát lại & highlight',
        'Từ Shop',
        'Tin tức',
      ]),
    );

    const imageSources = tree!.root
      .findAllByType(Image)
      .map(node => node.props.source);

    expect(imageSources).toEqual(
      expect.arrayContaining([
        require('../assets/image/banners/hero_shop_gi.jpg'),
        require('../assets/image/banners/hero_faceoff.jpg'),
        require('../assets/image/events/cup_hanoi_arena.jpg'),
      ]),
    );

    act(() => {
      tree!.unmount();
    });
  });
});
