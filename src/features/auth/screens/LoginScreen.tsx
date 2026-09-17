import { fontFamilies, semanticColors } from '@jujistu/shared/theme';
import { AppButton, AppInputField } from '@jujistu/ui';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthBackground } from '../components/AuthBackground';
import { AuthHero } from '../components/AuthHero';
import { useRequestOtpMutation } from '../queries/use-request-otp-mutation';

type LoginScreenProps = {
  onOtpRequested: (params: { challengeId: string; email: string }) => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({ onOtpRequested }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const requestOtpMutation = useRequestOtpMutation();
  const normalizedEmail = email.trim().toLowerCase();
  const errorMessage = validationError ?? requestOtpMutation.error?.message;

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setValidationError('Định dạng email không đúng. Vui lòng kiểm tra lại');
      return;
    }

    setValidationError(null);
    requestOtpMutation.mutate(
      { email: normalizedEmail },
      {
        onSuccess: challenge => {
          onOtpRequested({
            challengeId: challenge.challengeId,
            email: normalizedEmail,
          });
        },
      },
    );
  };

  const handleBlur = () => {
    if (normalizedEmail.length > 0 && !EMAIL_PATTERN.test(normalizedEmail)) {
      setValidationError('Định dạng email không đúng. Vui lòng kiểm tra lại');
    }
  };

  return (
    <AuthBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <AuthHero compact />
            <View style={styles.form}>
              <AppInputField
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
                error={Boolean(errorMessage)}
                keyboardType="email-address"
                onBlur={handleBlur}
                onChangeText={value => {
                  setEmail(value);
                  if (validationError) setValidationError(null);
                  if (requestOtpMutation.isError) requestOtpMutation.reset();
                }}
                placeholder="Email"
                size="lg"
                value={email}
              />
              {errorMessage ? (
                <Text accessibilityLiveRegion="polite" style={styles.error}>
                  {errorMessage}
                </Text>
              ) : null}
              <AppButton
                accessibilityLabel="Gửi mã OTP"
                containerStyle={styles.button}
                disabled={email.trim().length === 0}
                label="Đăng Nhập"
                loading={requestOtpMutation.isPending}
                onPress={handleSubmit}
                size="lg"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 24,
    width: '100%',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  error: {
    color: semanticColors.text.error,
    fontFamily: fontFamilies.primary.regular,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 4,
    marginTop: 8,
  },
  form: {
    marginTop: 32,
    width: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
