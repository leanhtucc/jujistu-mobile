import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { AppAnswerOption } from '@jujistu/ui';
import type { AnswerOptionProps } from '@jujistu/ui';
import { semanticColors } from '../src/shared/theme/semantic/colors';

function renderAnswerOption(props: Partial<AnswerOptionProps> = {}) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <AppAnswerOption label="Option A" onPress={jest.fn()} {...props} />,
    );
  });
  return tree;
}

function getControl(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findByProps({ accessibilityRole: 'button' });
}

describe('AppAnswerOption', () => {
  it('renders supplied text label with button accessibility role', () => {
    const tree = renderAnswerOption();
    const text = tree.root.findByType(Text);
    const control = getControl(tree);

    expect(text.props.children).toBe('Option A');
    expect(control.props.accessibilityRole).toBe('button');
  });

  it('renders image source when imageSource prop is provided', () => {
    const dummyImage = { uri: 'https://example.com/image.png' };
    const tree = renderAnswerOption({
      imageSource: dummyImage,
      imageAccessibilityLabel: 'Option image',
    });
    const image = tree.root.findByType(Image);

    expect(image.props.source).toEqual(dummyImage);
    expect(image.props.accessibilityLabel).toBe('Option image');
  });

  it('fires onPress callback when tapped in enabled state', () => {
    const onPress = jest.fn();
    const tree = renderAnswerOption({ onPress });
    const control = getControl(tree);

    act(() => control.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire callback and exposes disabled state when disabled', () => {
    const onPress = jest.fn();
    const tree = renderAnswerOption({ disabled: true, onPress });
    const control = getControl(tree);

    expect(control.props.accessibilityState.disabled).toBe(true);
    expect(control.props.onPress).toBeUndefined();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('supports controlled selected state and error feedback status', () => {
    const selectedTree = renderAnswerOption({ selected: true });
    expect(getControl(selectedTree).props.accessibilityState.selected).toBe(
      true,
    );

    const errorTree = renderAnswerOption({ state: 'error' });
    const text = errorTree.root.findByType(Text);
    expect(StyleSheet.flatten(text.props.style).color).toBe(
      semanticColors.text.error,
    );
  });
});
