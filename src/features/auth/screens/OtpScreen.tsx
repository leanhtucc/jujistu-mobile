import {
  getResponsiveContentWidth,
  selectResponsiveValue,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { fontFamilies, semanticColors } from '@jujistu/shared/theme';
import { AppButton, AppOtpField } from '@jujistu/ui';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRequestOtp } from '../hooks/use-request-otp';
import { useVerifyOtp } from '../hooks/use-verify-otp';

type OtpScreenProps = {
  challengeId: string;
  email: string;
  onClose: () => void;
};

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export function OtpScreen({
  challengeId: initialChallengeId,
  email,
  onClose,
}: OtpScreenProps) {
  const responsive = useResponsive();
  const panelWidth = getResponsiveContentWidth(responsive);
  const typography = selectResponsiveValue(responsive, {
    compactPhone: {
      actionFontSize: 14,
      actionLineHeight: 20,
      bodyFontSize: 14,
      bodyLineHeight: 20,
      titleFontSize: 22,
      titleLineHeight: 28,
    },
    phone: {
      actionFontSize: 15,
      actionLineHeight: 21,
      bodyFontSize: 15,
      bodyLineHeight: 22,
      titleFontSize: 25,
      titleLineHeight: 31,
    },
    largePhone: {
      actionFontSize: 16,
      actionLineHeight: 22,
      bodyFontSize: 16,
      bodyLineHeight: 24,
      titleFontSize: 28,
      titleLineHeight: 35,
    },
    tablet: {
      actionFontSize: 18,
      actionLineHeight: 24,
      bodyFontSize: 18,
      bodyLineHeight: 26,
      titleFontSize: 32,
      titleLineHeight: 40,
    },
    largeTablet: {
      actionFontSize: 20,
      actionLineHeight: 26,
      bodyFontSize: 20,
      bodyLineHeight: 28,
      titleFontSize: 36,
      titleLineHeight: 44,
    },
  });
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [challengeId, setChallengeId] = useState(initialChallengeId);
  const lastSubmittedCode = useRef<string | null>(null);
  const {
    requestOtp,
    isSubmitting: isResending,
    error: requestOtpError,
    clearError: clearRequestError,
  } = useRequestOtp();
  const {
    verifyOtp,
    isSubmitting: isVerifying,
    error: verifyOtpError,
    clearError: clearVerifyError,
  } = useVerifyOtp();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (
      code.length !== OTP_LENGTH ||
      isVerifying ||
      lastSubmittedCode.current === code
    ) {
      return;
    }

    lastSubmittedCode.current = code;
    verifyOtp({
      challengeId,
      code,
      email,
    }).catch(() => {
      // Error captured in verifyOtpError
    });
  }, [challengeId, code, email, isVerifying, verifyOtp]);

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    try {
      const challenge = await requestOtp({ email });
      setChallengeId(challenge.challengeId);
      setCode('');
      lastSubmittedCode.current = null;
      setCountdown(RESEND_SECONDS);
      clearVerifyError();
      clearRequestError();
    } catch {
      // Error captured in requestOtpError
    }
  };

  const errorMessage = verifyOtpError?.message ?? requestOtpError?.message;

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          <View
            accessibilityViewIsModal
            style={[styles.panel, { width: panelWidth }]}
          >
            <Pressable
              accessibilityLabel="Đóng xác minh OTP"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>

            <Text
              accessibilityRole="header"
              style={[
                styles.title,
                {
                  fontSize: typography.titleFontSize,
                  lineHeight: typography.titleLineHeight,
                },
              ]}
            >
              Verify your email
            </Text>
            <Text
              style={[
                styles.description,
                {
                  fontSize: typography.bodyFontSize,
                  lineHeight: typography.bodyLineHeight,
                },
              ]}
            >
              Vui lòng nhập mã OTP đã được gửi tới email{`\n`}
              <Text style={styles.email}>{email}</Text>.{`\n`}
              Mã có hiệu lực trong 30 phút
            </Text>

            <AppOtpField
              accessibilityLabel="Mã OTP gồm 6 số"
              containerStyle={styles.otp}
              disabled={isVerifying}
              onChangeText={value => {
                setCode(value);
                if (lastSubmittedCode.current !== value) {
                  clearVerifyError();
                  clearRequestError();
                }
              }}
              status={errorMessage ? 'error' : 'neutral'}
              value={code}
            />

            {errorMessage ? (
              <Text
                accessibilityLiveRegion="polite"
                style={[
                  styles.error,
                  {
                    fontSize: typography.bodyFontSize,
                    lineHeight: typography.bodyLineHeight,
                  },
                ]}
              >
                {errorMessage}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <AppButton
                containerStyle={styles.action}
                label="Đổi email khác"
                labelStyle={[
                  styles.actionLabel,
                  {
                    fontSize: typography.actionFontSize,
                    lineHeight: typography.actionLineHeight,
                  },
                ]}
                onPress={onClose}
                size="md"
                variant="secondaryDark"
              />
              <AppButton
                containerStyle={styles.action}
                disabled={countdown > 0 || isResending}
                label={
                  countdown > 0 ? `Gửi lại OTP (${countdown}s)` : 'Gửi lại OTP'
                }
                labelStyle={[
                  styles.actionLabel,
                  {
                    fontSize: typography.actionFontSize,
                    lineHeight: typography.actionLineHeight,
                  },
                ]}
                loading={isResending}
                onPress={handleResend}
                size="md"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  action: { flex: 1 },
  actionLabel: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    width: '100%',
  },
  closeButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 6,
    width: 44,
    zIndex: 1,
  },
  closeText: {
    color: semanticColors.text.primary,
    fontSize: 32,
    fontWeight: '200',
    lineHeight: 36,
  },
  description: {
    color: semanticColors.text.tertiary,
    fontFamily: fontFamilies.primary.regular,
    marginTop: 12,
    textAlign: 'center',
  },
  email: {
    color: semanticColors.text.primary,
    fontFamily: fontFamilies.primary.medium,
  },
  error: {
    color: semanticColors.text.error,
    fontFamily: fontFamilies.primary.regular,
    marginTop: 12,
    textAlign: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  otp: {
    alignSelf: 'center',
    marginTop: 24,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    flex: 1,
  },
  panel: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.strong,
    borderRadius: 6,
    borderWidth: 1,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 52,
  },
  safeArea: { flex: 1 },
  title: {
    color: semanticColors.text.primary,
    fontFamily: fontFamilies.display.regular,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
