import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { AppTab } from '@jujistu/ui';
import type { TabProps } from '@jujistu/ui';

function renderTab(props: Partial<TabProps> = {}) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <AppTab label="Overview" onPress={jest.fn()} {...props} />,
    );
  });
  return tree;
}

function getControl(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findByProps({ accessibilityRole: 'tab' });
}

describe('AppTab', () => {
  it('renders label with tab accessibility role', () => {
    const tree = renderTab({ label: 'Details' });
    const text = tree.root.findByType(Text);
    const control = getControl(tree);

    expect(text.props.children).toBe('Details');
    expect(control.props.accessibilityRole).toBe('tab');
  });

  it('reflects controlled selected state in accessibilityState', () => {
    const unselected = renderTab({ selected: false });
    expect(getControl(unselected).props.accessibilityState.selected).toBe(
      false,
    );

    const selected = renderTab({ selected: true });
    expect(getControl(selected).props.accessibilityState.selected).toBe(true);
  });

  it('fires onPress callback when enabled and blocks when disabled', () => {
    const onPress = jest.fn();
    const enabled = renderTab({ onPress });
    act(() => getControl(enabled).props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);

    const disabledPress = jest.fn();
    const disabled = renderTab({ disabled: true, onPress: disabledPress });
    expect(getControl(disabled).props.accessibilityState.disabled).toBe(true);
    expect(getControl(disabled).props.onPress).toBeUndefined();
    expect(disabledPress).not.toHaveBeenCalled();
  });
});
