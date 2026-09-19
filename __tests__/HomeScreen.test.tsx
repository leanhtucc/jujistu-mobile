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
        'Tin tức & Sự kiện',
        'Xem tất cả',
        'Bước lùi này không khiến cho Trần Quốc Tuấn lệch hướng',
        'Phạm Văn Hào 2 - 0 Trần Văn Trọng',
        'CLUB',
        'Leaderboard',
        'Học viện MMA',
        'Gift',
        'LIVE',
        'Minigame',
      ]),
    );

    const imageSources = tree!.root
      .findAllByType(Image)
      .map(node => node.props.source);

    expect(imageSources).toEqual(
      expect.arrayContaining([
        require('../assets/image/banners/banner_home_01.png'),
        require('../assets/image/banners/banner_home_02.png'),
        require('../assets/image/banners/banner_home_03.png'),
        require('../assets/image/news/news_01.png'),
        require('../assets/image/news/news_02.png'),
      ]),
    );

    act(() => {
      tree!.unmount();
    });
  });
});
