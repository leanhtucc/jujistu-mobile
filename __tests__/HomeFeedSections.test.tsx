import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AppIcon } from '@jujistu/ui';

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
      'Lịch giải',
      'Kết quả',
      'Vé',
      'Video',
      'CLB',
      'BXH',
      'Mini game',
    ]);
    expect(
      tree.root.findAllByType(AppIcon).map(node => node.props.name),
    ).toEqual([
      'calendarCheck',
      'medal',
      'ticket',
      'youtubeLogo',
      'usersThree',
      'ranking',
      'gameController',
    ]);

    const eventAction = tree.root.findByProps({
      accessibilityLabel: 'Vé',
    });
    act(() => eventAction.props.onPress());
    expect(onPressAction).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'tickets' }),
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

    const card = tree.root.findByProps({
      accessibilityLabel: 'Chọn chỗ cho Ngày 1 · Newaza Gi',
    });
    act(() => card.props.onPress());
    expect(onPressEvent).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'sess-1' }),
    );

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
        'Phát lại & highlight',
        'Chung kết NoGi 69 kg: Đức Anh vs Minh Khoa',
        'Tin tức',
        '30/09/2026',
      ]),
    );

    act(() => tree.unmount());
  });
});
