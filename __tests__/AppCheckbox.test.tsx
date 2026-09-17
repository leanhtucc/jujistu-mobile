import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { LinearGradient } from 'react-native-svg';

import { AppCheckbox } from '@jujistu/ui';

function renderCheckbox(
  props: Partial<React.ComponentProps<typeof AppCheckbox>> = {},
) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <AppCheckbox
        checked={false}
        label="Remember me"
        onValueChange={jest.fn()}
        size="md"
        {...props}
      />,
    );
  });
  return tree;
}

describe('AppCheckbox', () => {
  it('renders controlled checked state with the JUJISTU gradient', () => {
    const tree = renderCheckbox({ checked: true });
    const checkbox = tree.root.findByProps({ accessibilityRole: 'checkbox' });

    expect(checkbox.props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
    expect(tree.root.findAllByType(LinearGradient)).toHaveLength(1);
    expect(tree.root.findByType(Text).props.children).toBe('Remember me');
  });

  it('requests the inverse controlled value when pressed', () => {
    const onValueChange = jest.fn();
    const tree = renderCheckbox({ checked: false, onValueChange });
    const checkbox = tree.root.findByProps({ accessibilityRole: 'checkbox' });

    act(() => checkbox.props.onPress());
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('does not invoke the callback while disabled', () => {
    const onValueChange = jest.fn();
    const tree = renderCheckbox({ disabled: true, onValueChange });
    const checkbox = tree.root.findByProps({ accessibilityRole: 'checkbox' });

    expect(checkbox.props.disabled).toBe(true);
    expect(checkbox.props.onPress).toBeUndefined();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('gives indeterminate visual and accessibility precedence', () => {
    const tree = renderCheckbox({ checked: true, indeterminate: true });
    const checkbox = tree.root.findByProps({ accessibilityRole: 'checkbox' });
    const indicator = tree.root.findAllByType(View).find(node => {
      const style = StyleSheet.flatten(node.props.style);
      return style?.width === 16.333 * 0.5;
    });

    expect(checkbox.props.accessibilityState.checked).toBe('mixed');
    expect(indicator).toBeDefined();
  });
});
