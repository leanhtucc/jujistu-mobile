import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '@jujistu/features/home';
import { MissionScreen } from '@jujistu/features/missions';
import {
  NotificationCenter,
  useNotifications,
  type NotificationTarget,
} from '@jujistu/features/notifications';
import { AppButton, AppStampIn } from '@jujistu/ui';

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

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  act(() => {
    mounted.splice(0).forEach(tree => tree.unmount());
  });
  jest.useRealTimers();
});

function NotificationHarness({
  onNavigate,
}: {
  readonly onNavigate: (target: NotificationTarget) => void;
}) {
  const notifications = useNotifications();

  return (
    <>
      <Text testID="unread">{String(notifications.hasUnread)}</Text>
      <Text onPress={notifications.open} testID="open">
        open
      </Text>
      <NotificationCenter
        items={notifications.items}
        onClose={notifications.close}
        onSelect={item => notifications.select(item, onNavigate)}
        visible={notifications.isOpen}
      />
    </>
  );
}

describe('notification centre', () => {
  it('marks notifications read when opened', () => {
    const tree = render(<NotificationHarness onNavigate={jest.fn()} />);
    const unread = () =>
      tree.root.findByProps({ testID: 'unread' }).props.children;

    expect(unread()).toBe('true');
    expect(has(tree, 'notification-final-starts')).toBe(false);

    act(() => {
      tree.root.findByProps({ testID: 'open' }).props.onPress();
    });
    expect(unread()).toBe('false');
    expect(has(tree, 'notification-final-starts')).toBe(true);
  });

  it('closes and reports where a notification leads', () => {
    const onNavigate = jest.fn();
    const tree = render(<NotificationHarness onNavigate={onNavigate} />);
    act(() => {
      tree.root.findByProps({ testID: 'open' }).props.onPress();
    });

    act(() => {
      tree.root
        .findAllByProps({ testID: 'notification-final-starts' })[0]
        .props.onPress();
    });
    expect(onNavigate).toHaveBeenCalledWith({
      type: 'tournament',
      tournamentId: 'nat26',
      tab: 'Lịch thi đấu',
    });
    expect(has(tree, 'notification-final-starts')).toBe(false);

    act(() => {
      tree.root.findByProps({ testID: 'open' }).props.onPress();
    });
    act(() => {
      tree.root
        .findAllByProps({ testID: 'notification-login-coins' })[0]
        .props.onPress();
    });
    expect(onNavigate).toHaveBeenLastCalledWith({ type: 'missions' });
  });

  it('shows an empty state without notifications', () => {
    const tree = render(
      <NotificationCenter
        items={[]}
        onClose={jest.fn()}
        onSelect={jest.fn()}
        visible
      />,
    );
    expect(has(tree, 'notification-empty')).toBe(true);
  });
});

describe('Home unread badge', () => {
  it('hides the bell dot when nothing is unread', () => {
    const user = { displayName: 'Minh', avatarUrl: null };
    const unread = render(<HomeScreen user={user} />);
    expect(has(unread, 'home-unread-badge')).toBe(true);

    const read = render(
      <HomeScreen hasUnreadNotifications={false} user={user} />,
    );
    expect(has(read, 'home-unread-badge')).toBe(false);
  });

  it('shows the balance owned by the app', () => {
    const tree = render(
      <HomeScreen coinBalance={12550} user={{ displayName: 'Minh' }} />,
    );
    // The thousands separator depends on the runtime's locale data.
    expect(
      tree.root.findAll(node =>
        /^Số dư 12[.,]?550 xu$/.test(String(node.props.accessibilityLabel)),
      ).length,
    ).toBeGreaterThan(0);
  });
});

describe('shared wallet in missions', () => {
  it('shows the controlled balance and reports earned coins', () => {
    const onEarn = jest.fn();
    const tree = render(<MissionScreen coins={20000} onEarn={onEarn} />);
    expect(
      tree.root.findByProps({ testID: 'mission-coins' }).props
        .accessibilityLabel,
    ).toBe('Số dư 20.000 Xu');

    act(() => {
      tree.root.findByProps({ testID: 'mission-streak-claim' }).props.onPress();
    });
    expect(onEarn).toHaveBeenCalledWith(30);
    // The balance belongs to the app, so it stays until the app updates it.
    expect(
      tree.root.findByProps({ testID: 'mission-coins' }).props
        .accessibilityLabel,
    ).toBe('Số dư 20.000 Xu');
  });
});

describe('AppButton belt tip', () => {
  it('adds the tip to an enabled primary button only', () => {
    const tip = (props: Partial<React.ComponentProps<typeof AppButton>>) =>
      render(
        <AppButton label="Tiếp tục" onPress={jest.fn()} {...props} />,
      ).root.findAllByProps({ testID: 'app-belt-tip' }).length;

    expect(tip({})).toBe(0);
    expect(tip({ beltTip: true })).toBeGreaterThan(0);
    expect(tip({ beltTip: true, disabled: true })).toBe(0);
    expect(tip({ beltTip: true, appearance: 'soft' })).toBe(0);
    expect(tip({ beltTip: true, variant: 'secondaryDark' })).toBe(0);
  });
});

describe('AppStampIn', () => {
  it('renders its children while animating in', () => {
    const tree = render(
      <AppStampIn>
        <Text>ĐÃ ĐẶT</Text>
      </AppStampIn>,
    );
    expect(has(tree, 'app-stamp-in')).toBe(true);
    expect(tree.root.findAllByProps({ children: 'ĐÃ ĐẶT' }).length).toBe(2);
  });
});
