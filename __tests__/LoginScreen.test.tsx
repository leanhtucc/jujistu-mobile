import { LoginScreen } from '@jujistu/features/auth';
import { AppButton, AppInputField } from '@jujistu/ui';
import {
  notifyManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import * as authService from '../src/features/auth/services/auth-service';

beforeAll(() => {
  notifyManager.setScheduler(fn => fn());
});

jest.mock('../src/features/auth/services/auth-service', () => ({
  requestOtp: jest.fn(),
}));

function renderLoginScreen(props: {
  onOtpRequested?: (params: { challengeId: string; email: string }) => void;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <QueryClientProvider client={queryClient}>
        <LoginScreen onOtpRequested={props.onOtpRequested ?? jest.fn()} />
      </QueryClientProvider>,
    );
  });
  return tree;
}

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email input with autoFocus and disabled submit button when empty', () => {
    const tree = renderLoginScreen({});
    const input = tree.root.findByType(AppInputField);
    const button = tree.root.findByType(AppButton);

    expect(input.props.placeholder).toBe('Email');
    expect(input.props.autoFocus).toBe(true);
    expect(input.props.leadingIcon).toBe('mail');
    expect(input.props.size).toBe('md');
    expect(button.props.disabled).toBe(true);
    expect(button.props.label).toBe('Đăng Nhập');
    expect(button.props.size).toBe('md');
    expect(StyleSheet.flatten(button.props.labelStyle)).toMatchObject({
      fontSize: 18,
      lineHeight: 24,
    });
    expect(tree.root.findByType(KeyboardAvoidingView).props.behavior).toBe(
      Platform.OS === 'ios' ? 'padding' : 'height',
    );
  });

  it('shows validation error when invalid email format is entered and submitted', () => {
    const tree = renderLoginScreen({});
    const input = tree.root.findByType(AppInputField);
    const button = tree.root.findByType(AppButton);

    act(() => {
      input.props.onChangeText('invalid-email');
    });

    expect(button.props.disabled).toBe(false);

    act(() => {
      button.props.onPress();
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Định dạng email không đúng. Vui lòng kiểm tra lại');
    expect(authService.requestOtp).not.toHaveBeenCalled();

    const error = tree.root
      .findAllByType(Text)
      .find(node => node.props.accessibilityLiveRegion === 'polite');
    expect(error).toBeDefined();
    expect(StyleSheet.flatten(error!.props.style)).toMatchObject({
      lineHeight: 20,
      marginLeft: 4,
    });
    const ancestorGaps: number[] = [];
    let ancestor = error!.parent;
    while (ancestor) {
      const gap = StyleSheet.flatten(ancestor.props.style)?.gap;
      if (typeof gap === 'number') ancestorGaps.push(gap);
      ancestor = ancestor.parent;
    }
    expect(ancestorGaps).toEqual(expect.arrayContaining([6, 18]));
  });

  it('shows validation error on blur if email is invalid', () => {
    const tree = renderLoginScreen({});
    const input = tree.root.findByType(AppInputField);

    act(() => {
      input.props.onChangeText('invalid-email-format');
    });

    act(() => {
      input.props.onBlur();
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Định dạng email không đúng. Vui lòng kiểm tra lại');
  });

  it('submits valid email and calls onOtpRequested on success', async () => {
    (authService.requestOtp as jest.Mock).mockResolvedValueOnce({
      challengeId: 'mock-challenge-123',
      expiresInSeconds: 30,
    });

    const onOtpRequested = jest.fn();
    const tree = renderLoginScreen({ onOtpRequested });
    const input = tree.root.findByType(AppInputField);
    const button = tree.root.findByType(AppButton);

    act(() => {
      input.props.onChangeText('test.user@example.com');
    });

    await act(async () => {
      button.props.onPress();
    });

    expect(authService.requestOtp).toHaveBeenCalledWith({
      email: 'test.user@example.com',
    });
    expect(onOtpRequested).toHaveBeenCalledWith({
      challengeId: 'mock-challenge-123',
      email: 'test.user@example.com',
    });
  });

  it('displays API error message when requestOtp fails', async () => {
    (authService.requestOtp as jest.Mock).mockRejectedValueOnce(
      new Error('Email đã bị khóa hoặc không tồn tại'),
    );

    const tree = renderLoginScreen({});
    const input = tree.root.findByType(AppInputField);
    const button = tree.root.findByType(AppButton);

    act(() => {
      input.props.onChangeText('user@example.com');
    });

    await act(async () => {
      button.props.onPress();
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Email đã bị khóa hoặc không tồn tại');
  });
});
