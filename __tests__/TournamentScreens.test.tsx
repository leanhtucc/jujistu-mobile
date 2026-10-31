import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  TournamentDetailScreen,
  TournamentListScreen,
} from '@jujistu/features/tournaments';

import {
  buildSessionEntries,
  buildTournamentSections,
  getTournamentStatus,
  parseIsoDate,
} from '../src/features/tournaments/data/tournament-selectors';
import { TOURNAMENTS } from '../src/features/tournaments/data/tournament-content';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function render(element: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={metrics}>{element}</SafeAreaProvider>,
    );
  });
  return tree;
}

const TODAY = parseIsoDate('2026-09-28');

describe('tournament selectors', () => {
  it('classifies tournaments around the reference day', () => {
    const byId = (id: string) => TOURNAMENTS.find(t => t.id === id)!;
    expect(getTournamentStatus(byId('nat26'), TODAY).status).toBe('live');
    expect(getTournamentStatus(byId('hn'), TODAY)).toEqual({
      status: 'upcoming',
      daysUntilStart: 26,
    });
    expect(getTournamentStatus(byId('clb'), TODAY).status).toBe('done');
  });

  it('groups sections live, upcoming, done and filters by level', () => {
    const all = buildTournamentSections('Tất cả', TODAY);
    expect(all.map(section => section.status)).toEqual([
      'live',
      'upcoming',
      'done',
    ]);
    expect(all[1].items[0].tournament.id).toBe('asiad');
    expect(all[2].items.map(entry => entry.tournament.id)).toEqual([
      'yth',
      'clb',
    ]);

    const youth = buildTournamentSections('Trẻ', TODAY);
    expect(youth).toHaveLength(1);
    expect(youth[0].items[0].tournament.id).toBe('yth');
  });

  it('marks the 20:00 final as 28 minutes away at 19:32', () => {
    const entries = buildSessionEntries(4, {
      todayIndex: 4,
      nowMinutes: 19 * 60 + 32,
    });
    expect(entries.map(entry => entry.status)).toEqual([
      'done',
      'done',
      'done',
      'done',
      'now',
      'soon',
    ]);
    expect(entries[5].statusLabel).toBe('CÒN 28 PHÚT');
  });

  it('treats every session as done once the tournament is over', () => {
    const entries = buildSessionEntries(2, { todayIndex: null, nowMinutes: 0 });
    expect(entries.every(entry => entry.status === 'done')).toBe(true);
  });
});

describe('TournamentListScreen', () => {
  it('renders sections and filters by level', () => {
    const onSelect = jest.fn();
    const tree = render(<TournamentListScreen onSelectTournament={onSelect} />);

    expect(
      tree.root.findAllByProps({ testID: 'tournament-section-live' }).length,
    ).toBeGreaterThan(0);

    act(() => {
      tree.root.findByProps({ testID: 'tournament-level-Trẻ' }).props.onPress();
    });
    expect(
      tree.root.findAllByProps({ testID: 'tournament-section-live' }),
    ).toHaveLength(0);

    act(() => {
      tree.root.findByProps({ testID: 'tournament-item-yth' }).props.onPress();
    });
    expect(onSelect).toHaveBeenCalledWith('yth');
  });
});

describe('TournamentDetailScreen', () => {
  it('shows the schedule, results and medal tabs for the national final', () => {
    const tree = render(
      <TournamentDetailScreen onBack={jest.fn()} tournamentId="nat26" />,
    );
    expect(
      tree.root.findAllByProps({ testID: 'tournament-schedule-tab' }).length,
    ).toBeGreaterThan(0);

    act(() => {
      tree.root
        .findByProps({ testID: 'tournament-tab-Kết quả' })
        .props.onPress();
    });
    expect(
      tree.root.findAllByProps({ testID: 'tournament-results-tab' }).length,
    ).toBeGreaterThan(0);

    act(() => {
      tree.root
        .findByProps({ testID: 'tournament-tab-Tổng sắp' })
        .props.onPress();
    });
    expect(
      tree.root.findAllByProps({ testID: 'tournament-medal-row-1' }).length,
    ).toBeGreaterThan(0);
  });

  it('opens on the requested tab and falls back for the bracket tab', () => {
    const results = render(
      <TournamentDetailScreen
        initialTab="Kết quả"
        onBack={jest.fn()}
        tournamentId="nat26"
      />,
    );
    expect(
      results.root.findAllByProps({ testID: 'tournament-results-tab' }).length,
    ).toBeGreaterThan(0);

    const bracket = render(
      <TournamentDetailScreen
        initialTab="Nhánh đấu"
        onBack={jest.fn()}
        tournamentId="nat26"
      />,
    );
    expect(
      bracket.root.findAllByProps({ testID: 'tournament-schedule-tab' }).length,
    ).toBeGreaterThan(0);
  });

  it('shows the face-off and opens the athlete profile', () => {
    const onPressAthlete = jest.fn();
    const tree = render(
      <TournamentDetailScreen
        onBack={jest.fn()}
        onPressAthlete={onPressAthlete}
        tournamentId="nat26"
      />,
    );
    act(() => {
      tree.root.findByProps({ testID: 'tournament-face-off' }).props.onPress();
    });
    expect(onPressAthlete).toHaveBeenCalledWith('Trần Đức Anh');
  });

  it('shows brief info and a reminder CTA for an upcoming tournament', () => {
    const tree = render(
      <TournamentDetailScreen onBack={jest.fn()} tournamentId="hn" />,
    );
    expect(
      tree.root.findAllByProps({ testID: 'tournament-info' }).length,
    ).toBeGreaterThan(0);
    expect(
      tree.root.findAllByProps({ accessibilityLabel: 'Nhắc tôi khi có lịch' })
        .length,
    ).toBeGreaterThan(0);
  });

  it('shows a not-found state for an unknown tournament', () => {
    const tree = render(
      <TournamentDetailScreen onBack={jest.fn()} tournamentId="missing" />,
    );
    expect(
      tree.root.findAllByProps({ testID: 'tournament-not-found' }).length,
    ).toBeGreaterThan(0);
  });
});
