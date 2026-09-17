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

import { useRequestOtpMutation } from '../queries/use-request-otp-mutation';
import { useVerifyOtpMutation } from '../queries/use-verify-otp-mutation';

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
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [challengeId, setChallengeId] = useState(initialChallengeId);
  const lastSubmittedCode = useRef<string | null>(null);
  const requestOtpMutation = useRequestOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const isVerifying = verifyOtpMutation.isPending;

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
    verifyOtpMutation.mutate({
      challengeId,
      code,
      email,
    });
  }, [challengeId, code, email, isVerifying, verifyOtpMutation]);

  const handleResend = () => {
    if (countdown > 0 || requestOtpMutation.isPending) return;
    requestOtpMutation.mutate(
      { email },
      {
        onSuccess: challenge => {
          setChallengeId(challenge.challengeId);
          setCode('');
          lastSubmittedCode.current = null;
          setCountdown(RESEND_SECONDS);
          verifyOtpMutation.reset();
        },
      },
    );
  };

  const errorMessage =
    verifyOtpMutation.error?.message ?? requestOtpMutation.error?.message;

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          <View accessibilityViewIsModal style={styles.panel}>
            <Pressable
              accessibilityLabel="Đóng xác minh OTP"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>

            <Text accessibilityRole="header" style={styles.title}>
              Verify your email
            </Text>
            <Text style={styles.description}>
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
                  verifyOtpMutation.reset();
                }
              }}
              status={errorMessage ? 'error' : 'neutral'}
              value={code}
            />

            {errorMessage ? (
              <Text accessibilityLiveRegion="polite" style={styles.error}>
                {errorMessage}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <AppButton
                containerStyle={styles.action}
                label="Đổi email khác"
                onPress={onClose}
                size="md"
                variant="secondaryDark"
              />
              <AppButton
                containerStyle={styles.action}
                disabled={countdown > 0}
                label={
                  countdown > 0 ? `Gửi lại OTP (${countdown}s)` : 'Gửi lại OTP'
                }
                loading={requestOtpMutation.isPending}
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
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  email: {
    color: semanticColors.text.primary,
    fontFamily: fontFamilies.primary.medium,
  },
  error: {
    color: semanticColors.text.error,
    fontFamily: fontFamilies.primary.regular,
    fontSize: 12,
    lineHeight: 18,
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
    width: '100%',
  },
  safeArea: { flex: 1 },
  title: {
    color: semanticColors.text.primary,
    fontFamily: fontFamilies.display.regular,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
