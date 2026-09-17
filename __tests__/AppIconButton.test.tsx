import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { AppIconButton } from '@jujistu/ui';
import { AppIcon } from '../src/ui/atoms/icon';

function renderIconButton(
  props: Partial<React.ComponentProps<typeof AppIconButton>> = {},
) {
  let tree: ReactTestRenderer.ReactTestRenderer | null = null;

  act(() => {
    tree = ReactTestRenderer.create(
      <AppIconButton
        accessibilityLabel="Settings"
        icon="settings"
        onPress={jest.fn()}
        {...props}
      />,
    );
  });

  return tree!;
}

function getControl(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findByProps({ accessibilityRole: 'button' });
}

describe('AppIconButton', () => {
  it('renders a typed AppIcon and uses Figma small, medium and large geometry', () => {
    const small = renderIconButton({ size: 'sm' });
    const medium = renderIconButton({ size: 'md' });
    const large = renderIconButton({ size: 'lg' });
    const findSurfaceStyle = (tree: ReactTestRenderer.ReactTestRenderer) =>
      tree.root
        .findAllByType(View)
        .map(view => StyleSheet.flatten(view.props.style))
        .find(
          style => style?.height !== undefined && style?.width !== undefined,
        );

    expect(small.root.findByType(AppIcon).props.name).toBe('settings');
    expect(findSurfaceStyle(small)).toMatchObject({ height: 40, width: 40 });
    expect(findSurfaceStyle(medium)).toMatchObject({ height: 44, width: 44 });
    expect(findSurfaceStyle(large)).toMatchObject({ height: 56, width: 56 });
  });

  it('fires onPress when enabled and exposes its required accessible name', () => {
    const onPress = jest.fn();
    const control = getControl(renderIconButton({ onPress }));

    act(() => control.props.onPress());

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(control.props.accessibilityLabel).toBe('Settings');
  });

  it('prevents disabled/loading presses and replaces the icon while loading', () => {
    const disabledPress = jest.fn();
    const disabled = getControl(
      renderIconButton({ disabled: true, onPress: disabledPress }),
    );
    const loadingTree = renderIconButton({ loading: true });

    expect(disabled.props.onPress).toBeUndefined();
    expect(disabledPress).not.toHaveBeenCalled();
    expect(loadingTree.root.findAllByType(ActivityIndicator)).toHaveLength(1);
    expect(loadingTree.root.findAllByType(AppIcon)).toHaveLength(0);
  });
});
