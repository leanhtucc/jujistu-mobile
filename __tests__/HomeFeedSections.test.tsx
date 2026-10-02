import React from 'react';
import { Image, Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AppIcon } from '@jujistu/ui';

import { HOME_EVENT } from '../src/features/home/data/home-content';
import { HomeEventTicketSection } from '../src/features/home/components/HomeEventTicketSection';
import { HomeFeaturedVideoSection } from '../src/features/home/components/HomeFeaturedVideoSection';
import { HomeNewsSection } from '../src/features/home/components/HomeNewsSection';
import { HomeQuickActions } from '../src/features/home/components/HomeQuickActions';

describe('Home feed sections', () => {
  it('renders the six Figma quick actions and forwards presses', () => {
    const onPressAction = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <HomeQuickActions onPressAction={onPressAction} />,
      );
    });

    const labels = tree.root
      .findAllByType(Text)
      .map(node => node.props.children);
    expect(labels).toEqual([
      'Câu lạc bộ',
      'Leaderboard',
      'Vé sự kiện',
      'Học viện MMA',
      'Trực tiếp',
      'Mini game',
    ]);
    expect(
      tree.root.findAllByType(AppIcon).map(node => node.props.name),
    ).toEqual([
      'club',
      'leaderboard',
      'gift',
      'mmaAcademy',
      'live',
      'minigame',
    ]);

    const eventAction = tree.root.findByProps({
      accessibilityLabel: 'Vé sự kiện',
    });
    act(() => eventAction.props.onPress());
    expect(onPressAction).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'event-ticket' }),
    );

    act(() => tree.unmount());
  });

  it('renders the event artwork and forwards the event press', () => {
    const onPressEvent = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <HomeEventTicketSection onPressEvent={onPressEvent} />,
      );
    });

    expect(tree.root.findAllByType(Image)).toHaveLength(2);
    const card = tree.root.findByProps({
      accessibilityLabel: HOME_EVENT.title,
    });
    act(() => card.props.onPress());
    expect(onPressEvent).toHaveBeenCalledWith(HOME_EVENT);

    act(() => tree.unmount());
  });

  it('renders the two featured videos and the Figma news row', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <>
          <HomeFeaturedVideoSection />
          <HomeNewsSection />
        </>,
      );
    });

    const text = tree.root.findAllByType(Text).map(node => node.props.children);
    expect(text).toEqual(
      expect.arrayContaining([
        'Video nổi bật',
        'Trần Quốc Toản Vs Zakhar Dzmitrychenka',
        'Most Fiery Faceoffs of 2021',
        'Tin tức & Sự kiện',
        '10/03/2026',
      ]),
    );

    act(() => tree.unmount());
  });
});
