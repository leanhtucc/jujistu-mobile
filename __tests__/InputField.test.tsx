import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import Svg, { LinearGradient, Stop } from 'react-native-svg';

import { AppIcon, AppInputField } from '@jujistu/ui';
import type { InputFieldProps } from '@jujistu/ui';
import {
  inputFieldFocusedGradient,
  resolveInputFieldSizeRecipe,
  resolveInputFieldVisualRecipe,
  resolveInputVisualState,
} from '../src/ui/atoms/input-field-theme';
import { componentTypography } from '../src/shared/theme/semantic/typography';

function renderInput(props: Partial<InputFieldProps> = {}) {
  let tree: ReactTestRenderer.ReactTestRenderer | null = null;

  act(() => {
    tree = ReactTestRenderer.create(
      <AppInputField value="" onChangeText={jest.fn()} {...props} />,
    );
  });

  return tree!;
}

function getInput(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findByType(TextInput);
}

function getSurface(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findAllByType(View)[1];
}

function getOuterWrapper(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findAllByType(View)[0];
}

describe('AppInputField', () => {
  it('renders a controlled TextInput with the supplied value', () => {
    const tree = renderInput({ value: 'user@example.com' });
    const input = getInput(tree);

    expect(input.props.value).toBe('user@example.com');
    expect(input.props.defaultValue).toBeUndefined();
  });

  it('forwards onChangeText without changing the controlled value itself', () => {
    const onChangeText = jest.fn();
    const tree = renderInput({ value: 'before', onChangeText });
    const input = getInput(tree);

    act(() => input.props.onChangeText('after'));

    expect(onChangeText).toHaveBeenCalledWith('after');
    expect(getInput(tree).props.value).toBe('before');
  });

  it('defaults to sm and preserves both exact size recipes', () => {
    const defaultSurface = StyleSheet.flatten(
      getSurface(renderInput()).props.style,
    );
    const mdSurface = StyleSheet.flatten(
      getSurface(renderInput({ size: 'md' })).props.style,
    );

    expect(defaultSurface.height).toBe(40);
    expect(mdSurface.height).toBe(52);
    expect(resolveInputFieldSizeRecipe('sm')).toEqual({
      height: 40,
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 6,
      borderRadius: 4,
      borderWidth: 1,
    });
    expect(resolveInputFieldSizeRecipe('md').height).toBe(52);
    expect(resolveInputFieldSizeRecipe('lg').height).toBe(62);
  });

  it('accepts the neutral/error status API while preserving error precedence', () => {
    const tree = renderInput({ status: 'error', value: 'invalid' });

    expect(
      StyleSheet.flatten(getSurface(tree).props.style).backgroundColor,
    ).toBe('#FF3A5E');
    expect(
      resolveInputVisualState({
        disabled: true,
        error: true,
        focused: true,
        value: 'invalid',
      }),
    ).toBe('error');
  });

  it('makes disabled fields non-editable and ignores change callbacks', () => {
    const onChangeText = jest.fn();
    const input = getInput(renderInput({ disabled: true, onChangeText }));

    expect(input.props.editable).toBe(false);
    expect(input.props.onChangeText).toBeUndefined();
    expect(input.props.accessibilityState).toEqual({ disabled: true });
    expect(onChangeText).not.toHaveBeenCalled();
  });

  it('applies exact padding, radius, gap, stroke width and typography', () => {
    const tree = renderInput();
    const surfaceStyle = StyleSheet.flatten(getSurface(tree).props.style);
    const inputStyle = StyleSheet.flatten(getInput(tree).props.style);
    const innerSurface = tree.root
      .findAllByType(View)
      .find(
        view => StyleSheet.flatten(view.props.style)?.position === 'absolute',
      )!;
    const innerStyle = StyleSheet.flatten(innerSurface.props.style);

    expect(surfaceStyle).toMatchObject({ borderRadius: 4, gap: 6 });
    expect(inputStyle).toMatchObject({
      ...componentTypography.inputPlaceholder,
      paddingHorizontal: 16,
      paddingVertical: 10,
    });
    expect(innerStyle).toMatchObject({ top: 1, right: 1, bottom: 1, left: 1 });
  });

  it('uses the exact default surface and placeholder colors', () => {
    const tree = renderInput({ placeholder: 'Email' });
    const surfaceStyle = StyleSheet.flatten(getSurface(tree).props.style);

    expect(surfaceStyle.backgroundColor).toBe('#292929');
    expect(getInput(tree).props.placeholderTextColor).toBe('#7D7F84');
    expect(StyleSheet.flatten(getInput(tree).props.style).color).toBe(
      '#7D7F84',
    );
  });

  it('renders the verified leading icon without exposing it to accessibility', () => {
    const tree = renderInput({ leadingIcon: 'mail', size: 'md' });
    const icon = tree.root.findByType(AppIcon);
    const inputStyle = StyleSheet.flatten(getInput(tree).props.style);

    expect(icon.props).toMatchObject({
      accessible: false,
      color: '#9E9E9E',
      name: 'mail',
      size: 20,
    });
    expect(inputStyle).toMatchObject({
      paddingHorizontal: 16,
      paddingLeft: 0,
    });
  });

  it('resolves default, filled and whitespace-only content deterministically', () => {
    expect(
      resolveInputVisualState({ error: false, focused: false, value: '' }),
    ).toBe('default');
    expect(
      resolveInputVisualState({ error: false, focused: false, value: 'text' }),
    ).toBe('filled');
    expect(
      resolveInputVisualState({ error: false, focused: false, value: ' ' }),
    ).toBe('filled');
  });

  it('uses white entered text in the non-focused filled state', () => {
    const inputStyle = StyleSheet.flatten(
      getInput(renderInput({ value: 'entered' })).props.style,
    );

    expect(inputStyle.color).toBe('#FFFFFF');
  });

  it('uses exact error border, text and empty placeholder treatment', () => {
    const tree = renderInput({ error: true, placeholder: 'Email' });
    const surfaceStyle = StyleSheet.flatten(getSurface(tree).props.style);
    const input = getInput(tree);

    expect(surfaceStyle.backgroundColor).toBe('#FF3A5E');
    expect(StyleSheet.flatten(input.props.style).color).toBe('#FF3A5E');
    expect(input.props.placeholderTextColor).toBe('#FF3A5E');
  });

  it('enforces error > focused > filled > default precedence', () => {
    expect(
      resolveInputVisualState({ error: true, focused: true, value: '' }),
    ).toBe('error');
    expect(
      resolveInputVisualState({ error: true, focused: false, value: 'x' }),
    ).toBe('error');
    expect(
      resolveInputVisualState({ error: false, focused: true, value: 'x' }),
    ).toBe('focused');
  });

  it('updates focused visual state on focus and restores default on blur', () => {
    const tree = renderInput();

    expect(tree.root.findAllByType(Svg)).toHaveLength(0);
    act(() => getInput(tree).props.onFocus());
    expect(tree.root.findAllByType(Svg)).toHaveLength(1);
    expect(StyleSheet.flatten(getInput(tree).props.style).color).toBe(
      '#FFFFFF',
    );

    act(() => getInput(tree).props.onBlur());
    expect(tree.root.findAllByType(Svg)).toHaveLength(0);
  });

  it('keeps the error recipe when the errored field receives focus', () => {
    const tree = renderInput({ error: true, value: 'invalid' });

    act(() => getInput(tree).props.onFocus());

    expect(tree.root.findAllByType(Svg)).toHaveLength(0);
    expect(
      StyleSheet.flatten(getSurface(tree).props.style).backgroundColor,
    ).toBe('#FF3A5E');
    expect(StyleSheet.flatten(getInput(tree).props.style).color).toBe(
      '#FF3A5E',
    );
  });

  it('renders all exact focused gradient stops and alpha values', () => {
    const tree = renderInput();
    act(() => getInput(tree).props.onFocus());
    const stops = tree.root.findAllByType(Stop);

    expect(stops.map(stop => stop.props.offset)).toEqual([
      0, 0.6477574110031128, 1,
    ]);
    expect(stops.map(stop => stop.props.stopOpacity)).toEqual([
      0.10000000149011612, 0.019999999552965164, 0.20000000298023224,
    ]);
    expect(stops.map(stop => stop.props.stopColor)).toEqual([
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
    ]);
  });

  it('uses the exact Figma-to-SVG gradient transform conversion', () => {
    const tree = renderInput();
    act(() => getInput(tree).props.onFocus());
    const gradient = tree.root.findByType(LinearGradient);

    expect(inputFieldFocusedGradient.transform).toEqual([
      6.123234262925839e-17, -1, 1, 6.123234262925839e-17, 0, 1,
    ]);
    expect(gradient.props).toMatchObject({
      x1: '0',
      y1: '0',
      x2: '1',
      y2: '0',
      gradientUnits: 'objectBoundingBox',
      gradientTransform: [...inputFieldFocusedGradient.transform],
    });
  });

  it('uses an absolute non-interactive responsive SVG without layout measurement', () => {
    const tree = renderInput();
    act(() => getInput(tree).props.onFocus());
    const svg = tree.root.findByType(Svg);

    expect(svg.props).toMatchObject({
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      preserveAspectRatio: 'none',
      viewBox: '0 0 1 1',
    });
    expect(getSurface(tree).props.onLayout).toBeUndefined();
  });

  it('forwards only the approved native behavior props', () => {
    const input = getInput(
      renderInput({
        secureTextEntry: true,
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        autoComplete: 'email',
      }),
    );

    expect(input.props).toMatchObject({
      secureTextEntry: true,
      keyboardType: 'email-address',
      autoCapitalize: 'none',
      autoComplete: 'email',
    });
    expect(getInput(renderInput()).props.secureTextEntry).toBe(false);
  });

  it('forwards accessibilityLabel only when supplied', () => {
    expect(getInput(renderInput()).props.accessibilityLabel).toBeUndefined();
    expect(
      getInput(renderInput({ accessibilityLabel: 'Địa chỉ email' })).props
        .accessibilityLabel,
    ).toBe('Địa chỉ email');
  });

  it('does not emit an unsupported invalid accessibility state', () => {
    const input = getInput(renderInput({ error: true }));

    expect(input.props.accessibilityState).toBeUndefined();
    expect(input.props['aria-invalid']).toBeUndefined();
  });

  it('keeps containerStyle on the outer wrapper only', () => {
    const tree = renderInput({
      containerStyle: {
        alignSelf: 'stretch',
        backgroundColor: '#0000FF',
        width: 310,
      },
    });
    const outerStyle = StyleSheet.flatten(getOuterWrapper(tree).props.style);
    const surfaceStyle = StyleSheet.flatten(getSurface(tree).props.style);

    expect(outerStyle).toMatchObject({
      alignSelf: 'stretch',
      backgroundColor: '#0000FF',
      width: 310,
    });
    expect(surfaceStyle).toMatchObject({
      backgroundColor: '#292929',
      borderRadius: 4,
      height: 40,
    });
    expect(surfaceStyle.width).toBeUndefined();
  });

  it('keeps internal recipes private from the public barrel', () => {
    const defaultRecipe = resolveInputFieldVisualRecipe('default');
    const focusedRecipe = resolveInputFieldVisualRecipe('focused');
    const filledRecipe = resolveInputFieldVisualRecipe('filled');
    const errorRecipe = resolveInputFieldVisualRecipe('error');

    expect(defaultRecipe).toMatchObject({
      backgroundColor: '#292929',
      borderColor: '#292929',
      placeholderColor: '#7D7F84',
      usesFocusedGradient: false,
    });
    expect(focusedRecipe).toMatchObject({
      backgroundColor: '#292929',
      textColor: '#FFFFFF',
      usesFocusedGradient: true,
    });
    expect(filledRecipe.textColor).toBe('#FFFFFF');
    expect(errorRecipe).toMatchObject({
      borderColor: '#FF3A5E',
      textColor: '#FF3A5E',
      usesFocusedGradient: false,
    });
  });

  it('does not expose unsupported or deferred public concepts', () => {
    type HasDefaultValue = 'defaultValue' extends keyof InputFieldProps
      ? true
      : false;
    type HasDisabled = 'disabled' extends keyof InputFieldProps ? true : false;
    type HasEditable = 'editable' extends keyof InputFieldProps ? true : false;
    type HasMultiline = 'multiline' extends keyof InputFieldProps
      ? true
      : false;
    type HasIcon = 'leadingIcon' extends keyof InputFieldProps ? true : false;
    type HasSuffix = 'suffix' extends keyof InputFieldProps ? true : false;
    type HasButton = 'button' extends keyof InputFieldProps ? true : false;
    type HasLabel = 'label' extends keyof InputFieldProps ? true : false;
    type HasHelper = 'helperText' extends keyof InputFieldProps ? true : false;
    type HasState = 'state' extends keyof InputFieldProps ? true : false;
    type HasInputStyle = 'inputStyle' extends keyof InputFieldProps
      ? true
      : false;

    const unsupported: [
      HasDefaultValue,
      HasDisabled,
      HasEditable,
      HasMultiline,
      HasIcon,
      HasSuffix,
      HasButton,
      HasLabel,
      HasHelper,
      HasState,
      HasInputStyle,
    ] = [
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ];

    expect(unsupported).toEqual([
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });
});
