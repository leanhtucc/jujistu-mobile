import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import {
  AppAvatar,
  AppCard,
  AppChip,
  AppProgressBar,
  AppSegmentedControl,
  AppTag,
} from '@jujistu/ui';
import { motionDuration, radius, spacing } from '@jujistu/shared/theme';

function render(element: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(element);
  });
  return tree;
}

describe('design system tokens', () => {
  it('exposes the Jujitsu Mobile radii, gutter and motion durations', () => {
    expect(radius.card).toBe(14);
    expect(radius.banner).toBe(20);
    expect(radius.sheet).toBe(28);
    expect(spacing.gutter).toBe(20);
    expect(motionDuration.base).toBe(180);
  });
});

describe('AppCard', () => {
  it('renders lapel cut by default and omits it when disabled', () => {
    const withLapel = render(<AppCard />);
    expect(
      withLapel.root.findAllByProps({ testID: 'app-card-lapel' }),
    ).not.toHaveLength(0);

    const flat = render(<AppCard lapel={false} />);
    expect(flat.root.findAllByProps({ testID: 'app-card-lapel' })).toHaveLength(
      0,
    );
  });

  it('renders the stitched seam only when requested', () => {
    expect(
      render(<AppCard stitched />).root.findAllByProps({
        testID: 'app-card-seam',
      }),
    ).not.toHaveLength(0);
    expect(
      render(<AppCard />).root.findAllByProps({ testID: 'app-card-seam' }),
    ).toHaveLength(0);
  });
});

describe('AppChip', () => {
  it('reports selected state and fires onPress', () => {
    const onPress = jest.fn();
    const tree = render(
      <AppChip label="Newaza Gi" onPress={onPress} selected />,
    );
    const chip = tree.root.findByProps({ accessibilityLabel: 'Newaza Gi' });
    expect(chip.props.accessibilityState).toEqual({ selected: true });
    act(() => chip.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('AppSegmentedControl', () => {
  it('calls onChange with the pressed key', () => {
    const onChange = jest.fn();
    const tree = render(
      <AppSegmentedControl
        activeKey="today"
        onChange={onChange}
        options={[
          { key: 'today', label: 'Hôm nay' },
          { key: 'week', label: 'Tuần này' },
        ]}
      />,
    );
    act(() =>
      tree.root
        .findByProps({ testID: 'app-segmented-control-week' })
        .props.onPress(),
    );
    expect(onChange).toHaveBeenCalledWith('week');
  });
});

describe('AppProgressBar', () => {
  it('clamps the value into 0..100', () => {
    const tree = render(<AppProgressBar value={1.8} />);
    expect(
      tree.root.findByProps({ testID: 'app-progress-bar' }).props
        .accessibilityValue.now,
    ).toBe(100);
    const empty = render(<AppProgressBar value={-3} />);
    expect(
      empty.root.findByProps({ testID: 'app-progress-bar' }).props
        .accessibilityValue.now,
    ).toBe(0);
  });
});

describe('AppAvatar', () => {
  it('falls back to initials and shows a belt strap when ranked', () => {
    const tree = render(
      <AppAvatar belt="brown" degrees={2} name="Trần Đức Anh" />,
    );
    expect(tree.root.findAllByProps({ children: 'TA' })).not.toHaveLength(0);
    expect(
      tree.root.findAllByProps({ testID: 'app-belt-bar' }),
    ).not.toHaveLength(0);
  });
});

describe('AppTag', () => {
  it('renders its label', () => {
    const tree = render(<AppTag label="TRỰC TIẾP" variant="accent" />);
    expect(
      tree.root.findAllByProps({ children: 'TRỰC TIẾP' }),
    ).not.toHaveLength(0);
  });
});
