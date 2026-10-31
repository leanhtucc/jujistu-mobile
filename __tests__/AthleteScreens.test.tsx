import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  AthleteJourneyScreen,
  AthleteListScreen,
} from '@jujistu/features/athletes';

import {
  filterAthletes,
  filterCareer,
  findAthlete,
  normalizeSearchText,
} from '../src/features/athletes/data/athlete-selectors';
import { buildFeaturedProfile } from '../src/features/athletes/data/athlete-content';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const mounted: ReactTestRenderer.ReactTestRenderer[] = [];

afterEach(() => {
  // Unmounting clears the notice timer so it cannot fire after teardown.
  act(() => {
    mounted.splice(0).forEach(tree => tree.unmount());
  });
});

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

describe('athlete selectors', () => {
  it('normalizes Vietnamese text for search', () => {
    expect(normalizeSearchText('  Trần Đức ANH ')).toBe('tran duc anh');
  });

  it('searches without diacritics and filters by discipline', () => {
    expect(filterAthletes('duc anh', 'Tất cả').map(a => a.id)).toEqual([
      'tran-duc-anh',
    ]);
    expect(filterAthletes('thai nguyen', 'Tất cả').length).toBe(3);
    expect(filterAthletes('', 'Fighting').map(a => a.name)).toEqual([
      'Ngô Hoàng Nam',
      'Lý Hoàng Phúc',
    ]);
    expect(filterAthletes('zzz', 'Tất cả')).toHaveLength(0);
  });

  it('resolves athletes by id or legacy display name', () => {
    expect(findAthlete('tran-duc-anh')?.name).toBe('Trần Đức Anh');
    expect(findAthlete('Trần Đức Anh')?.id).toBe('tran-duc-anh');
    expect(findAthlete('khong-co')).toBeUndefined();
  });

  it('filters the career by medals, video and milestones', () => {
    const { career } = buildFeaturedProfile(false);
    const kinds = (filter: Parameters<typeof filterCareer>[1]) =>
      filterCareer(career, filter).flatMap(year => year.items);

    expect(kinds('Cột mốc').every(item => item.kind === 'milestone')).toBe(
      true,
    );
    // The pending final is not a medal.
    expect(kinds('Huy chương').some(item => item.id === 'nat26n')).toBe(false);
    expect(kinds('Có video').every(item => item.kind === 'event')).toBe(true);
    expect(filterCareer(career, 'Tất cả')).toBe(career);
  });

  it('turns the pending final into a gold medal once played', () => {
    const played = buildFeaturedProfile(true);
    expect(played.medals[0].count).toBe(10);
    const final = played.career[0].items[0];
    expect(final.kind === 'event' && final.outcome).toBe('HCV');
  });
});

describe('AthleteListScreen', () => {
  it('shows the spotlight and opens an athlete with a profile', () => {
    const onSelect = jest.fn();
    const tree = render(<AthleteListScreen onSelectAthlete={onSelect} />);
    expect(has(tree, 'athlete-spotlight')).toBe(true);

    act(() => {
      tree.root
        .findByProps({ testID: 'athlete-row-tran-duc-anh' })
        .props.onPress();
    });
    expect(onSelect).toHaveBeenCalledWith('tran-duc-anh');
  });

  it('raises a notice instead of navigating for athletes without a profile', () => {
    const onSelect = jest.fn();
    const tree = render(<AthleteListScreen onSelectAthlete={onSelect} />);

    act(() => {
      tree.root
        .findByProps({ testID: 'athlete-row-dang-minh-khoa' })
        .props.onPress();
    });
    expect(onSelect).not.toHaveBeenCalled();
    expect(has(tree, 'athlete-notice')).toBe(true);
  });

  it('hides the spotlight and shows the empty state when searching', () => {
    const tree = render(<AthleteListScreen />);
    const input = tree.root.findByProps({
      accessibilityLabel: 'Tìm vận động viên hoặc đoàn',
    });
    act(() => {
      input.props.onChangeText('zzz');
    });
    expect(has(tree, 'athlete-spotlight')).toBe(false);
    expect(has(tree, 'athlete-empty')).toBe(true);
  });

  it('filters by discipline', () => {
    const tree = render(<AthleteListScreen />);
    act(() => {
      tree.root
        .findByProps({ testID: 'athlete-discipline-Duo' })
        .props.onPress();
    });
    expect(has(tree, 'athlete-row-ha-minh-tu-le-bao-ngoc')).toBe(true);
    expect(has(tree, 'athlete-row-tran-duc-anh')).toBe(false);
  });
});

describe('AthleteJourneyScreen', () => {
  it('renders the hero, stats, career and rivals', () => {
    const tree = render(<AthleteJourneyScreen onBack={jest.fn()} />);
    [
      'athlete-hero',
      'athlete-stats',
      'athlete-career',
      'athlete-rivals',
    ].forEach(id => expect(has(tree, id)).toBe(true));
  });

  it('expands and collapses an event', () => {
    const tree = render(
      <AthleteJourneyScreen athleteId="Trần Đức Anh" onBack={jest.fn()} />,
    );
    const toggle = () =>
      tree.root
        .findByProps({ testID: 'athlete-event-toggle-nat26g' })
        .props.onPress();
    const expanded = () =>
      tree.root.findByProps({ testID: 'athlete-event-toggle-nat26g' }).props
        .accessibilityState.expanded;

    expect(expanded()).toBe(false);
    act(toggle);
    expect(expanded()).toBe(true);
    act(toggle);
    expect(expanded()).toBe(false);
  });

  it('applies the career filter', () => {
    const tree = render(<AthleteJourneyScreen onBack={jest.fn()} />);
    act(() => {
      tree.root
        .findByProps({ testID: 'athlete-filter-Cột mốc' })
        .props.onPress();
    });
    expect(has(tree, 'athlete-milestone-m-belt')).toBe(true);
    expect(has(tree, 'athlete-event-nat26g')).toBe(false);
  });

  it('toggles the follow button', () => {
    const tree = render(<AthleteJourneyScreen onBack={jest.fn()} />);
    const label = () =>
      tree.root.findAllByProps({ accessibilityLabel: 'Đang theo dõi VĐV' })
        .length;
    expect(label()).toBe(0);
    act(() => {
      tree.root
        .findAllByProps({ accessibilityLabel: 'Theo dõi VĐV' })[0]
        .props.onPress();
    });
    expect(label()).toBeGreaterThan(0);
  });

  it('shows a pending state for athletes without a journey', () => {
    const tree = render(
      <AthleteJourneyScreen athleteId="dang-minh-khoa" onBack={jest.fn()} />,
    );
    expect(has(tree, 'athlete-not-found')).toBe(true);
    expect(has(tree, 'athlete-hero')).toBe(false);
  });

  it('shows a not-found state for an unknown athlete', () => {
    const tree = render(
      <AthleteJourneyScreen athleteId="khong-co" onBack={jest.fn()} />,
    );
    expect(has(tree, 'athlete-not-found')).toBe(true);
  });
});
