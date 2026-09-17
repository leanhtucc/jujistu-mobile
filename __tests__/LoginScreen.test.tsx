import { authApi, LoginScreen } from '@jujistu/features/auth';
import { AppButton, AppInputField } from '@jujistu/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

jest.mock('@jujistu/features/auth/api/auth.api', () => ({
  authApi: {
    requestOtp: jest.fn(),
  },
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
    expect(button.props.disabled).toBe(true);
    expect(button.props.label).toBe('Đăng Nhập');
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
    expect(authApi.requestOtp).not.toHaveBeenCalled();
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
    (authApi.requestOtp as jest.Mock).mockResolvedValueOnce({
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

    expect(authApi.requestOtp).toHaveBeenCalledWith({
      email: 'test.user@example.com',
    });
    expect(onOtpRequested).toHaveBeenCalledWith({
      challengeId: 'mock-challenge-123',
      email: 'test.user@example.com',
    });
  });

  it('displays API error message when requestOtp fails', async () => {
    (authApi.requestOtp as jest.Mock).mockRejectedValueOnce(
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
