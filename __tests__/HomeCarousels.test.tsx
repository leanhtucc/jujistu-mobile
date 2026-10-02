import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { HomeHeroCarousel } from '../src/features/home/components/HomeHeroCarousel';
import { HomeNewsSection } from '../src/features/home/components/HomeNewsSection';

describe('Home carousel behavior', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('auto-scrolls the hero through adjacent pages without wrapping', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<HomeHeroCarousel />);
    });

    const getCarousel = () =>
      tree.root
        .findAllByType(View)
        .find(
          node => node.props.accessibilityLabel === 'Banner sự kiện nổi bật',
        )!;

    expect(getCarousel().props.accessibilityValue.now).toBe(2);

    act(() => {
      jest.advanceTimersByTime(4_000);
    });

    expect(getCarousel().props.accessibilityValue.now).toBe(3);

    act(() => {
      jest.advanceTimersByTime(4_000);
    });

    expect(getCarousel().props.accessibilityValue.now).toBe(2);

    act(() => tree.unmount());
  });

  it('renders the redesigned news row without an automatic scroller', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<HomeNewsSection />);
    });

    const titles = tree.root
      .findAllByType(Text)
      .map(node => node.props.children);

    expect(tree.root.findAllByType(ScrollView)).toHaveLength(0);
    expect(titles).toEqual(
      expect.arrayContaining([
        'Phạm Văn Hào 2 - 0 Trần Trọng, chiến thắng áp đảo trong trận đấu MMA đầy kịch tính',
        '10/03/2026',
      ]),
    );

    act(() => tree.unmount());
  });
});
