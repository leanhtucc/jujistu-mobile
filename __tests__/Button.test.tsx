import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import Svg, { LinearGradient, Stop } from 'react-native-svg';

import { AppButton } from '@jujistu/ui';
import type { ButtonProps } from '@jujistu/ui';
import {
  resolveAppButtonSizeRecipe,
  resolveAppButtonVisualRecipe,
} from '../src/ui/atoms/button-theme';
import { componentTypography } from '../src/shared/theme/semantic/typography';
import { opacity } from '../src/shared/theme/tokens/opacity';

function renderButton(props: Partial<ButtonProps> = {}) {
  let tree: ReactTestRenderer.ReactTestRenderer | null = null;

  act(() => {
    tree = ReactTestRenderer.create(
      <AppButton label="Tiếp tục" onPress={jest.fn()} {...props} />,
    );
  });

  return tree!;
}

function getControl(tree: ReactTestRenderer.ReactTestRenderer) {
  const controls = tree.root.findAllByProps({ accessibilityRole: 'button' });
  return controls[controls.length - 1];
}

function getPressable(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findAllByProps({ accessibilityRole: 'button' })[0];
}

function getSurface(tree: ReactTestRenderer.ReactTestRenderer) {
  return getControl(tree).children[0] as ReactTestRenderer.ReactTestInstance;
}

function getContent(tree: ReactTestRenderer.ReactTestRenderer) {
  return getSurface(tree).findByType(Text).parent!;
}

describe('AppButton', () => {
  it('renders its required label with the approved Button typography', () => {
    const tree = renderButton();
    const label = tree.root.findByType(Text);

    expect(label.props.children).toBe('Tiếp tục');
    expect(StyleSheet.flatten(label.props.style)).toMatchObject(
      componentTypography.button,
    );
  });

  it('uses a readable default label without clipping Vietnamese diacritics', () => {
    const tree = renderButton();
    const labelStyle = StyleSheet.flatten(
      tree.root.findByType(Text).props.style,
    );

    expect(labelStyle).toMatchObject({
      fontSize: 16,
      includeFontPadding: true,
      lineHeight: 24,
    });
  });

  it('defaults to the primary variant and md size', () => {
    const tree = renderButton();
    const surfaceStyle = StyleSheet.flatten(getSurface(tree).props.style);
    const contentStyle = StyleSheet.flatten(getContent(tree).props.style);

    expect(tree.root.findAllByType(Svg)).toHaveLength(1);
    expect(surfaceStyle.height).toBe(48);
    expect(surfaceStyle.backgroundColor).toBe('transparent');
    expect(surfaceStyle.overflow).toBe('hidden');
    expect(contentStyle.paddingHorizontal).toBe(16);
    expect(contentStyle.paddingVertical).toBe(12);
    expect(contentStyle.alignItems).toBe('center');
  });

  it('renders the exact enabled primary gradient from red to orange', () => {
    const tree = renderButton();
    const recipe = resolveAppButtonVisualRecipe('primary', false);
    const gradient = tree.root.findByType(LinearGradient);
    const stops = tree.root.findAllByType(Stop);
    const surfaceStyle = StyleSheet.flatten(getSurface(tree).props.style);

    expect(recipe).toMatchObject({
      backgroundColor: 'transparent',
      foregroundColor: '#FFFFFF',
      gradient: {
        left: '#A70100',
        right: '#FE8B33',
      },
    });
    expect(gradient.props).toMatchObject({
      x1: '0%',
      x2: '100%',
      y1: '50%',
      y2: '50%',
    });
    expect(stops[0].props).toMatchObject({
      offset: '0',
      stopColor: '#A70100',
    });
    expect(stops[1].props).toMatchObject({
      offset: '1',
      stopColor: '#FE8B33',
    });
    expect(surfaceStyle.backgroundColor).toBe('transparent');
  });

  it('uses the exact solid primary disabled recipe before disabled opacity', () => {
    const recipe = resolveAppButtonVisualRecipe('primary', true);
    const tree = renderButton({ disabled: true });
    const surfaceStyle = StyleSheet.flatten(getSurface(tree).props.style);

    expect(recipe).toMatchObject({
      backgroundColor: '#BA2025',
      foregroundColor: '#FFFFFF',
      opacity: opacity.disabled,
    });
    expect(recipe.gradient).toBeUndefined();
    expect(tree.root.findAllByType(Svg)).toHaveLength(0);
    expect(surfaceStyle).toMatchObject({
      backgroundColor: '#BA2025',
      opacity: opacity.disabled,
    });
  });

  it.each([
    ['secondaryDark', '#2C2C2C', '#FFFFFF'],
    ['secondaryLight', '#FFFFFF', '#2C2C2C'],
  ] as const)(
    'renders the %s visual recipe',
    (variant, backgroundColor, foregroundColor) => {
      const recipe = resolveAppButtonVisualRecipe(variant, false);
      const tree = renderButton({ variant });
      const labelStyle = StyleSheet.flatten(
        tree.root.findByType(Text).props.style,
      );
      const surfaceStyle = StyleSheet.flatten(getSurface(tree).props.style);

      expect(recipe).toMatchObject({ backgroundColor, foregroundColor });
      expect(surfaceStyle.backgroundColor).toBe(backgroundColor);
      expect(labelStyle.color).toBe(foregroundColor);
    },
  );

  it('preserves exact md and content-dependent sm size recipes', () => {
    expect(resolveAppButtonSizeRecipe('md', false)).toMatchObject({
      height: 48,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 4,
      borderRadius: 4,
      iconSize: 16,
    });
    expect(resolveAppButtonSizeRecipe('sm', false).height).toBe(30);
    expect(resolveAppButtonSizeRecipe('sm', true).height).toBe(32);
  });

  it('adds the Figma-grounded lg size without changing sm or md', () => {
    expect(resolveAppButtonSizeRecipe('lg', false)).toMatchObject({
      height: 56,
      paddingHorizontal: 24,
      iconSize: 20,
    });
  });

  it('renders loading as busy and prevents presses', () => {
    const onPress = jest.fn();
    const tree = renderButton({ loading: true, onPress });
    const control = getPressable(tree);

    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(1);
    expect(control.props.accessibilityState).toEqual({
      busy: true,
      disabled: true,
    });
    expect(control.props.onPress).toBeUndefined();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('supports outline, ghost and soft recipes with pressed feedback', () => {
    expect(
      resolveAppButtonVisualRecipe('primary', false, 'outline'),
    ).toMatchObject({
      backgroundColor: 'transparent',
      borderColor: '#FE8B33',
      borderWidth: 1,
    });
    expect(
      resolveAppButtonVisualRecipe('primary', false, 'ghost').backgroundColor,
    ).toBe('transparent');
    expect(
      resolveAppButtonVisualRecipe('primary', false, 'soft').backgroundColor,
    ).toBe('#222222');
    expect(
      resolveAppButtonVisualRecipe('primary', false, 'filled', true).opacity,
    ).toBe(0.8);
  });

  it('fires onPress when enabled and removes the handler when disabled', () => {
    const enabledPress = jest.fn();
    const enabledTree = renderButton({ onPress: enabledPress });

    act(() => {
      getPressable(enabledTree).props.onPress();
    });
    expect(enabledPress).toHaveBeenCalledTimes(1);

    const disabledPress = jest.fn();
    const disabledTree = renderButton({
      disabled: true,
      onPress: disabledPress,
    });
    const disabledControl = getPressable(disabledTree);

    expect(disabledControl.props.disabled).toBe(true);
    expect(disabledControl.props.onPress).toBeUndefined();
    expect(disabledPress).not.toHaveBeenCalled();
  });

  it('sets its button role and correct disabled accessibility state', () => {
    const enabled = getControl(renderButton());
    const disabled = getControl(renderButton({ disabled: true }));

    expect(enabled.props.accessibilityRole).toBe('button');
    expect(enabled.props.accessibilityState).toEqual({ disabled: false });
    expect(disabled.props.accessibilityState).toEqual({ disabled: true });
  });

  it('forwards only a supplied accessibilityLabel', () => {
    const implicit = getControl(renderButton());
    const explicit = getControl(
      renderButton({ accessibilityLabel: 'Tiếp tục thanh toán' }),
    );

    expect(implicit.props.accessibilityLabel).toBeUndefined();
    expect(explicit.props.accessibilityLabel).toBe('Tiếp tục thanh toán');
  });

  it('keeps container layout styles outside the internal visual recipe', () => {
    const tree = renderButton({
      containerStyle: { alignSelf: 'stretch', width: 175 },
    });
    const pressable = getControl(tree);
    const surfaceStyle = StyleSheet.flatten(getSurface(tree).props.style);

    expect(StyleSheet.flatten(pressable.props.style)).toMatchObject({
      alignSelf: 'stretch',
      width: 175,
    });
    expect(surfaceStyle).toMatchObject({ borderRadius: 4, height: 48 });
    expect(surfaceStyle.width).toBeUndefined();
  });

  it('does not expose deferred or unsupported public props', () => {
    type HasLoading = 'loading' extends keyof ButtonProps ? true : false;
    type HasFullWidth = 'fullWidth' extends keyof ButtonProps ? true : false;
    type HasChildren = 'children' extends keyof ButtonProps ? true : false;
    type HasIconOnly = 'iconOnly' extends keyof ButtonProps ? true : false;

    const contract: [HasLoading, HasFullWidth, HasChildren, HasIconOnly] = [
      true,
      false,
      false,
      false,
    ];

    expect(contract).toEqual([true, false, false, false]);
  });
});
