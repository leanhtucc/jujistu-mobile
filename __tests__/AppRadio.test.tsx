import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { LinearGradient } from 'react-native-svg';

import { AppRadio } from '@jujistu/ui';

function renderRadio(
  props: Partial<React.ComponentProps<typeof AppRadio>> = {},
) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <AppRadio
        checked={false}
        label="Option"
        onPress={jest.fn()}
        size="md"
        {...props}
      />,
    );
  });
  return tree;
}

describe('AppRadio', () => {
  it('renders parent-controlled selected and unselected states', () => {
    const unselected = renderRadio();
    const selected = renderRadio({ checked: true });

    expect(
      unselected.root.findByProps({ accessibilityRole: 'radio' }).props
        .accessibilityState.checked,
    ).toBe(false);
    expect(unselected.root.findAllByType(LinearGradient)).toHaveLength(0);
    expect(
      selected.root.findByProps({ accessibilityRole: 'radio' }).props
        .accessibilityState.checked,
    ).toBe(true);
    expect(selected.root.findAllByType(LinearGradient)).toHaveLength(1);
  });

  it('invokes the parent callback when pressed', () => {
    const onPress = jest.fn();
    const tree = renderRadio({ onPress });
    const radio = tree.root.findByProps({ accessibilityRole: 'radio' });

    act(() => radio.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the callback while disabled', () => {
    const onPress = jest.fn();
    const tree = renderRadio({ disabled: true, onPress });
    const radio = tree.root.findByProps({ accessibilityRole: 'radio' });

    expect(radio.props.accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });
    expect(radio.props.onPress).toBeUndefined();
    expect(onPress).not.toHaveBeenCalled();
  });
});
