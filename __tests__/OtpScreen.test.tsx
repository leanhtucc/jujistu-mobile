import { authApi, OtpScreen } from '@jujistu/features/auth';
import { tokenManager } from '@jujistu/shared/services/api';
import { AppButton, AppOtpField } from '@jujistu/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

jest.mock('@jujistu/features/auth/api/auth.api', () => ({
  authApi: {
    requestOtp: jest.fn(),
    verifyOtp: jest.fn(),
  },
}));

jest.mock('@jujistu/shared/services/api', () => {
  const actual = jest.requireActual('@jujistu/shared/services/api');
  return {
    ...actual,
    tokenManager: {
      saveTokens: jest.fn().mockResolvedValue(undefined),
      getAccessToken: jest.fn().mockResolvedValue(null),
      clearTokens: jest.fn().mockResolvedValue(undefined),
    },
  };
});

describe('OtpScreen', () => {
  let currentTree: ReactTestRenderer.ReactTestRenderer | null = null;

  function renderOtpScreen(props: {
    challengeId?: string;
    email?: string;
    onClose?: () => void;
  }): ReactTestRenderer.ReactTestRenderer {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    act(() => {
      currentTree = ReactTestRenderer.create(
        <QueryClientProvider client={queryClient}>
          <OtpScreen
            challengeId={props.challengeId ?? 'challenge-123'}
            email={props.email ?? 'fighter@example.com'}
            onClose={props.onClose ?? jest.fn()}
          />
        </QueryClientProvider>,
      );
    });
    return currentTree!;
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (currentTree) {
      await act(async () => {
        currentTree!.unmount();
      });
      currentTree = null;
    }
  });

  it('renders title, email, 6-digit OTP field, and action buttons', () => {
    const tree = renderOtpScreen({ email: 'boxer@example.com' });
    const json = JSON.stringify(tree.toJSON());

    expect(json).toContain('Verify your email');
    expect(json).toContain('boxer@example.com');
    expect(json).toContain('Đổi email khác');
    expect(json).toContain('Gửi lại OTP (30s)');

    const otpField = tree.root.findByType(AppOtpField);
    expect(otpField.props.digitCount).toBeUndefined();
  });

  it('calls onClose when close button or "Đổi email khác" is pressed', () => {
    const onClose = jest.fn();
    const tree = renderOtpScreen({ onClose });

    // Press close icon button (×)
    const closeBtn = tree.root.findByProps({
      accessibilityLabel: 'Đóng xác minh OTP',
    });
    act(() => {
      closeBtn.props.onPress();
    });
    expect(onClose).toHaveBeenCalledTimes(1);

    // Press "Đổi email khác" button
    const changeEmailBtn = tree.root.findByProps({ label: 'Đổi email khác' });
    act(() => {
      changeEmailBtn.props.onPress();
    });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('automatically triggers verification when 6 digits are entered', async () => {
    (authApi.verifyOtp as jest.Mock).mockResolvedValueOnce({
      accessToken: 'access-token-xyz',
      refreshToken: 'refresh-token-xyz',
      user: {
        id: 'u-1',
        email: 'fighter@example.com',
        displayName: 'Fighter',
      },
    });

    const tree = renderOtpScreen({
      challengeId: 'challenge-abc',
      email: 'fighter@example.com',
    });
    const otpField = tree.root.findByType(AppOtpField);

    await act(async () => {
      otpField.props.onChangeText('123456');
    });

    expect(authApi.verifyOtp).toHaveBeenCalledWith({
      challengeId: 'challenge-abc',
      code: '123456',
      email: 'fighter@example.com',
    });
    expect(tokenManager.saveTokens).toHaveBeenCalledWith({
      accessToken: 'access-token-xyz',
      refreshToken: 'refresh-token-xyz',
    });
  });

  it('displays error message when OTP verification fails', async () => {
    (authApi.verifyOtp as jest.Mock).mockRejectedValueOnce(
      new Error('Mã OTP không chính xác hoặc đã hết hạn'),
    );

    const tree = renderOtpScreen({
      challengeId: 'challenge-abc',
      email: 'fighter@example.com',
    });
    const otpField = tree.root.findByType(AppOtpField);

    await act(async () => {
      otpField.props.onChangeText('999999');
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Mã OTP không chính xác hoặc đã hết hạn');
  });

  it('decrements countdown timer and enables resend button after 30 seconds', async () => {
    jest.useFakeTimers();

    try {
      (authApi.requestOtp as jest.Mock).mockResolvedValueOnce({
        challengeId: 'new-challenge-456',
        expiresInSeconds: 30,
      });

      const tree = renderOtpScreen({});
      const buttons = tree.root.findAllByType(AppButton);
      const resendBtn = buttons.find(b =>
        b.props.label.includes('Gửi lại OTP'),
      );
      expect(resendBtn).toBeDefined();
      expect(resendBtn!.props.disabled).toBe(true);
      expect(resendBtn!.props.label).toBe('Gửi lại OTP (30s)');

      // Fast-forward 10 seconds (1 second per tick)
      for (let i = 0; i < 10; i++) {
        act(() => {
          jest.advanceTimersByTime(1000);
        });
      }
      expect(resendBtn!.props.label).toBe('Gửi lại OTP (20s)');
      expect(resendBtn!.props.disabled).toBe(true);

      // Fast-forward remaining 20 seconds
      for (let i = 0; i < 20; i++) {
        act(() => {
          jest.advanceTimersByTime(1000);
        });
      }
      expect(resendBtn!.props.label).toBe('Gửi lại OTP');
      expect(resendBtn!.props.disabled).toBe(false);

      // Click Resend
      await act(async () => {
        resendBtn!.props.onPress();
      });

      expect(authApi.requestOtp).toHaveBeenCalled();
    } finally {
      if (currentTree) {
        act(() => {
          currentTree!.unmount();
        });
        currentTree = null;
      }
      jest.clearAllTimers();
      jest.useRealTimers();
    }
  });
});
