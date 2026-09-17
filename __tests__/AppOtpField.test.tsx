import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { AppOtpField } from '@jujistu/ui';

function renderOtp(
  props: Partial<React.ComponentProps<typeof AppOtpField>> = {},
) {
  let tree: ReactTestRenderer.ReactTestRenderer | null = null;

  act(() => {
    tree = ReactTestRenderer.create(
      <AppOtpField value="" onChangeText={jest.fn()} {...props} />,
    );
  });

  return tree!;
}

describe('AppOtpField', () => {
  it('is controlled and defaults to six Figma-sized small cells', () => {
    const tree = renderOtp({ value: '12' });
    const input = tree.root.findByType(TextInput);
    const cells = tree.root.findAllByType(View).slice(1);

    expect(input.props.value).toBe('12');
    expect(input.props.maxLength).toBeUndefined();
    expect(tree.root.findAllByType(Text)).toHaveLength(6);
    expect(StyleSheet.flatten(cells[0].props.style)).toMatchObject({
      height: 56,
      width: 44,
    });
  });

  it('normalizes pasted text to digits and supports shorter backspace updates', () => {
    const onChangeText = jest.fn();
    const input = renderOtp({ onChangeText }).root.findByType(TextInput);

    act(() => input.props.onChangeText('12 3a4567'));
    act(() => input.props.onChangeText('12'));

    expect(onChangeText).toHaveBeenNthCalledWith(1, '123456');
    expect(onChangeText).toHaveBeenNthCalledWith(2, '12');
  });

  it('supports configurable count plus exact medium and large cell sizes', () => {
    const medium = renderOtp({ digitCount: 4, size: 'md' });
    const large = renderOtp({ digitCount: 4, size: 'lg' });

    expect(medium.root.findAllByType(Text)).toHaveLength(4);
    expect(
      StyleSheet.flatten(medium.root.findAllByType(View)[1].props.style),
    ).toMatchObject({ height: 60, width: 48 });
    expect(
      StyleSheet.flatten(large.root.findAllByType(View)[1].props.style),
    ).toMatchObject({ height: 64, width: 52 });
  });

  it('uses numeric OTP semantics and disables editing without changing value', () => {
    const onChangeText = jest.fn();
    const input = renderOtp({
      disabled: true,
      onChangeText,
      status: 'error',
      value: '12',
    }).root.findByType(TextInput);

    expect(input.props).toMatchObject({
      autoComplete: 'sms-otp',
      editable: false,
      keyboardType: 'number-pad',
      textContentType: 'oneTimeCode',
      value: '12',
    });
    expect(input.props.onChangeText).toBeUndefined();
    expect(input.props.accessibilityState).toEqual({ disabled: true });
    expect(onChangeText).not.toHaveBeenCalled();
  });
});
