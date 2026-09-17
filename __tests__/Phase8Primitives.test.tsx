import React from 'react';
import { StyleSheet, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { LinearGradient } from 'react-native-svg';

import {
  AppDivider,
  AppOverlay,
  AppPaginationDot,
  AppPasswordDot,
  AppProgress,
  AppToggle,
} from '@jujistu/ui';
import { semanticColors } from '@jujistu/shared/theme';

function render(element: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(element);
  });
  return tree;
}

describe('Phase 8 primitive components', () => {
  it('renders configurable horizontal and vertical dividers', () => {
    const horizontal = render(<AppDivider length={120} />);
    const vertical = render(<AppDivider direction="vertical" length={44} />);

    expect(
      StyleSheet.flatten(horizontal.root.findAllByType(View)[0].props.style),
    ).toMatchObject({ width: 120, height: 16 });
    expect(
      StyleSheet.flatten(vertical.root.findAllByType(View)[0].props.style),
    ).toMatchObject({ width: 1, height: 44 });
  });

  it('mounts the absolute overlay only while visible', () => {
    const hidden = render(<AppOverlay visible={false} />);
    const visible = render(<AppOverlay visible />);

    expect(hidden.toJSON()).toBeNull();
    expect(
      StyleSheet.flatten(visible.root.findByType(View).props.style),
    ).toMatchObject({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      backgroundColor: semanticColors.background.overlay,
    });
  });

  it('matches pagination dimensions and active gradient behavior', () => {
    const inactive = render(<AppPaginationDot size="large" />);
    const active = render(<AppPaginationDot active size="medium" />);

    expect(
      StyleSheet.flatten(inactive.root.findByType(View).props.style),
    ).toMatchObject({ width: 10, height: 10 });
    expect(
      StyleSheet.flatten(active.root.findByType(View).props.style),
    ).toMatchObject({ width: 20, height: 8 });
    expect(active.root.findAllByType(LinearGradient)).toHaveLength(1);
  });

  it('renders password-dot size and filled, empty, disabled states', () => {
    const filled = render(<AppPasswordDot size="small" />);
    const empty = render(<AppPasswordDot size="medium" state="empty" />);
    const disabled = render(<AppPasswordDot size="large" state="disabled" />);

    expect(
      StyleSheet.flatten(filled.root.findByType(View).props.style),
    ).toMatchObject({
      width: 8,
      height: 8,
      backgroundColor: semanticColors.icon.primary,
    });
    expect(
      StyleSheet.flatten(empty.root.findByType(View).props.style),
    ).toMatchObject({
      width: 10,
      height: 10,
      backgroundColor: semanticColors.background.surfaceSubtle,
      borderColor: semanticColors.border.strong,
    });
    expect(
      StyleSheet.flatten(disabled.root.findByType(View).props.style),
    ).toMatchObject({
      width: 12,
      height: 12,
      backgroundColor: semanticColors.icon.tertiary,
    });
  });

  it('renders completed and upcoming progress segments without percentage logic', () => {
    const completed = render(<AppProgress status="completed" />);
    const upcoming = render(<AppProgress status="upcoming" />);

    expect(completed.root.findAllByType(LinearGradient)).toHaveLength(1);
    expect(upcoming.root.findAllByType(LinearGradient)).toHaveLength(0);
    expect(
      StyleSheet.flatten(upcoming.root.findByType(View).props.style),
    ).toMatchObject({
      width: 200,
      height: 8,
      backgroundColor: semanticColors.background.surfaceSubtle,
    });
  });

  it('requests the inverse controlled toggle value and exposes switch state', () => {
    const onValueChange = jest.fn();
    const tree = render(
      <AppToggle
        accessibilityLabel="Notifications"
        value={false}
        onValueChange={onValueChange}
      />,
    );
    const toggle = tree.root.findByProps({ accessibilityRole: 'switch' });

    expect(toggle.props.accessibilityRole).toBe('switch');
    expect(toggle.props.accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });
    act(() => toggle.props.onPress());
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('does not change a disabled toggle', () => {
    const onValueChange = jest.fn();
    const tree = render(
      <AppToggle disabled value onValueChange={onValueChange} />,
    );
    const toggle = tree.root.findByProps({ accessibilityRole: 'switch' });

    expect(toggle.props.disabled).toBe(true);
    expect(toggle.props.accessibilityState).toEqual({
      checked: true,
      disabled: true,
    });
    expect(toggle.props.onPress).toBeUndefined();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
