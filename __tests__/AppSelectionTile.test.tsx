import React from 'react';
import { StyleSheet, Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { AppCheckbox, AppSelectionTile } from '@jujistu/ui';
import type { SelectionTileProps } from '@jujistu/ui';
import { semanticColors } from '../src/shared/theme/semantic/colors';

function renderSelectionTile(props: Partial<SelectionTileProps> = {}) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <AppSelectionTile title="Tile Title" onPress={jest.fn()} {...props} />,
    );
  });
  return tree;
}

function getControl(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findByProps({ accessibilityRole: 'button' });
}

describe('AppSelectionTile', () => {
  it('renders supplied title, description, badge and info content', () => {
    const tree = renderSelectionTile({
      title: 'Beginner Level',
      description: 'Learn the fundamentals',
      badge: 'POPULAR',
      info: '10 lessons',
    });

    const texts = tree.root
      .findAllByType(Text)
      .map(node => node.props.children);
    expect(texts).toContain('Beginner Level');
    expect(texts).toContain('Learn the fundamentals');
    expect(texts).toContain('POPULAR');
    expect(texts).toContain('10 lessons');
  });

  it('renders selected state with correct accessibility and accent border', () => {
    const tree = renderSelectionTile({ selected: true });
    const control = getControl(tree);

    expect(control.props.accessibilityState.selected).toBe(true);
    expect(StyleSheet.flatten(control.props.style).borderColor).toBe(
      semanticColors.border.accent,
    );
  });

  it('composes AppCheckbox when showTrailingIcon is true', () => {
    const tree = renderSelectionTile({ checked: true, showTrailingIcon: true });
    const checkbox = tree.root.findByType(AppCheckbox);

    expect(checkbox.props.checked).toBe(true);
  });

  it('invokes onPress callback when clicked in interactive state', () => {
    const onPress = jest.fn();
    const tree = renderSelectionTile({ onPress });
    const control = getControl(tree);

    act(() => control.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not invoke callback and exposes disabled state when disabled', () => {
    const onPress = jest.fn();
    const tree = renderSelectionTile({ disabled: true, onPress });
    const control = getControl(tree);

    expect(control.props.accessibilityState.disabled).toBe(true);
    expect(control.props.onPress).toBeUndefined();
    expect(onPress).not.toHaveBeenCalled();
  });
});
