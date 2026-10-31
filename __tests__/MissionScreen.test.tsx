import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MissionScreen } from '@jujistu/features/missions';

import {
  advanceMission,
  buildStreak,
  formatCoins,
  formatCountdown,
} from '../src/features/missions/data/mission-selectors';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const mounted: ReactTestRenderer.ReactTestRenderer[] = [];

function render(element: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>{element}</SafeAreaProvider>,
    );
  });
  mounted.push(tree);
  return tree;
}

function has(tree: ReactTestRenderer.ReactTestRenderer, testID: string) {
  return tree.root.findAllByProps({ testID }).length > 0;
}

function coinLabel(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findByProps({ testID: 'mission-coins' }).props
    .accessibilityLabel;
}

function pressMissionButton(
  tree: ReactTestRenderer.ReactTestRenderer,
  missionId: string,
  label: string,
) {
  const row = tree.root.findByProps({ testID: `mission-row-${missionId}` });
  const button = row.findAllByProps({ accessibilityRole: 'button' })[0];
  expect(button).toBeDefined();
  expect(row.findAllByProps({ children: label }).length).toBeGreaterThan(0);
  act(() => {
    button.props.onPress();
  });
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  act(() => {
    mounted.splice(0).forEach(tree => tree.unmount());
  });
  jest.useRealTimers();
});

describe('mission selectors', () => {
  it('formats coins with Vietnamese grouping', () => {
    expect(formatCoins(12500)).toBe('12.500');
    expect(formatCoins(50)).toBe('50');
    expect(formatCoins(1234567)).toBe('1.234.567');
  });

  it('formats the refresh countdown', () => {
    expect(formatCountdown(16071)).toBe('04:27:51');
    expect(formatCountdown(-5)).toBe('00:00:00');
  });

  it('completes a mission on its last step', () => {
    const definition = {
      id: 'video',
      icon: 'play' as const,
      title: 'Xem video',
      reward: 100,
      target: 2,
    };
    const base = { progress: 1, status: 'todo' as const, busy: true };
    expect(advanceMission(definition, base)).toEqual({
      progress: 2,
      status: 'claimable',
      busy: false,
    });
    expect(advanceMission(definition, { ...base, progress: 0 }).status).toBe(
      'todo',
    );
  });

  it('marks today and locks the remaining streak days', () => {
    const states = (claimed: boolean) =>
      buildStreak(claimed).map(day => day.state);
    expect(states(false)).toEqual([
      'done',
      'done',
      'done',
      'done',
      'today',
      'locked',
      'locked',
    ]);
    expect(states(true)[4]).toBe('done');
    expect(buildStreak(false)[6].isFinal).toBe(true);
  });
});

describe('MissionScreen', () => {
  it('renders the balance, streak, weekly progress and daily missions', () => {
    const tree = render(<MissionScreen />);
    expect(coinLabel(tree)).toBe('Số dư 12.500 Xu');
    expect(has(tree, 'mission-streak')).toBe(true);
    expect(has(tree, 'mission-week')).toBe(true);
    ['login', 'video', 'live5', 'rules'].forEach(id =>
      expect(has(tree, `mission-row-${id}`)).toBe(true),
    );
    expect(has(tree, 'mission-claimed-rules')).toBe(true);
  });

  it('claims a mission reward and shows a toast', () => {
    const tree = render(<MissionScreen />);
    pressMissionButton(tree, 'login', 'Nhận');

    expect(coinLabel(tree)).toBe('Số dư 12.550 Xu');
    expect(has(tree, 'mission-claimed-login')).toBe(true);
    expect(has(tree, 'mission-toast')).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(has(tree, 'mission-toast')).toBe(false);
  });

  it('records progress after the content opens, then allows claiming', () => {
    const tree = render(<MissionScreen />);
    pressMissionButton(tree, 'video', 'Thực hiện');
    // While opening, the button reads "Đang mở…" and the step is not counted.
    expect(
      tree.root
        .findByProps({ testID: 'mission-row-video' })
        .findAllByProps({ children: 'Đang mở…' }).length,
    ).toBeGreaterThan(0);

    act(() => {
      jest.advanceTimersByTime(1200);
    });
    const row = tree.root.findByProps({ testID: 'mission-row-video' });
    expect(row.findAllByProps({ children: 'Nhận' }).length).toBeGreaterThan(0);

    pressMissionButton(tree, 'video', 'Nhận');
    expect(coinLabel(tree)).toBe('Số dư 12.600 Xu');
  });

  it('claims the login streak once', () => {
    const tree = render(<MissionScreen />);
    act(() => {
      tree.root.findByProps({ testID: 'mission-streak-claim' }).props.onPress();
    });
    expect(coinLabel(tree)).toBe('Số dư 12.530 Xu');
    expect(has(tree, 'mission-streak-claim')).toBe(false);
    expect(has(tree, 'mission-streak-done-4')).toBe(true);
  });

  it('switches to the weekly missions', () => {
    const tree = render(<MissionScreen />);
    act(() => {
      tree.root.findByProps({ testID: 'mission-tabs-week' }).props.onPress();
    });
    expect(has(tree, 'mission-row-w1')).toBe(true);
    expect(has(tree, 'mission-row-login')).toBe(false);
  });

  it('shows system-recorded missions without an action button', () => {
    const tree = render(<MissionScreen />);
    const row = tree.root.findByProps({ testID: 'mission-row-live5' });
    expect(row.findAllByProps({ accessibilityRole: 'button' })).toHaveLength(0);
    expect(
      row.findAllByProps({ children: 'Tự ghi nhận' }).length,
    ).toBeGreaterThan(0);
  });

  it('counts down to the next refresh', () => {
    const tree = render(<MissionScreen />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      tree.root.findAllByProps({ children: '04:27:48' }).length,
    ).toBeGreaterThan(0);
  });
});
