import {
  getResponsiveContentWidth,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { fontFamilies, semanticColors } from '@jujistu/shared/theme';
import { AppButton, AppInputField } from '@jujistu/ui';
import React, { useState } from 'react';
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHero } from '../components/AuthHero';
import { useRequestOtp } from '../hooks/use-request-otp';

type LoginScreenProps = {
  onBack?: () => void;
  onOtpRequested: (params: { challengeId: string; email: string }) => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({ onBack, onOtpRequested }: LoginScreenProps) {
  const responsive = useResponsive();
  const contentWidth = getResponsiveContentWidth(responsive);

  React.useEffect(() => {
    if (!onBack) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onBack();
        return true;
      },
    );
    return () => subscription.remove();
  }, [onBack]);
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { requestOtp, isSubmitting, error, clearError } = useRequestOtp();
  const normalizedEmail = email.trim().toLowerCase();
  const errorMessage = validationError ?? error?.message;

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setValidationError('Định dạng email không đúng. Vui lòng kiểm tra lại');
      return;
    }

    setValidationError(null);
    try {
      const challenge = await requestOtp({ email: normalizedEmail });
      onOtpRequested({
        challengeId: challenge.challengeId,
        email: normalizedEmail,
      });
    } catch {
      // Error is captured in hook state
    }
  };

  const handleBlur = () => {
    if (normalizedEmail.length > 0 && !EMAIL_PATTERN.test(normalizedEmail)) {
      setValidationError('Định dạng email không đúng. Vui lòng kiểm tra lại');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <AuthHero compact />
          <View style={[styles.form, { width: contentWidth }]}>
            <View style={styles.field}>
              <AppInputField
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
                error={Boolean(errorMessage)}
                keyboardType="email-address"
                leadingIcon="mail"
                onBlur={handleBlur}
                onChangeText={value => {
                  setEmail(value);
                  if (validationError) setValidationError(null);
                  if (error) clearError();
                }}
                placeholder="Email"
                size="md"
                value={email}
              />
              {errorMessage ? (
                <Text accessibilityLiveRegion="polite" style={styles.error}>
                  {errorMessage}
                </Text>
              ) : null}
            </View>
            <AppButton
              accessibilityLabel="Gửi mã OTP"
              containerStyle={styles.button}
              disabled={email.trim().length === 0 || isSubmitting}
              label="Đăng Nhập"
              labelStyle={styles.buttonLabel}
              loading={isSubmitting}
              onPress={handleSubmit}
              size="md"
            />

            {/* vn-law-check: Điều 5 khoản 2 42/VBHN-BCT & Luật 91/2025/QH15 */}
            <View style={styles.legalFooter}>
              <Text style={styles.legalNotice}>
                Bằng việc đăng nhập, bạn đồng ý với{' '}
                <Text style={styles.legalLink}>Điều khoản</Text> &{' '}
                <Text style={styles.legalLink}>
                  Chính sách bảo vệ dữ liệu cá nhân
                </Text>
              </Text>
              <Text style={styles.operatorInfo}>
                Đơn vị vận hành: JUJISTU Vietnam · support@jujistu.vn
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  legalFooter: {
    alignItems: 'center',
    gap: 4,
    marginTop: 18,
  },
  legalNotice: {
    color: semanticColors.text.tertiary,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  legalLink: {
    color: semanticColors.text.secondary,
    textDecorationLine: 'underline',
  },
  operatorInfo: {
    color: semanticColors.text.tertiary,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  buttonLabel: {
    fontSize: 18,
    lineHeight: 24,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  error: {
    color: semanticColors.text.error,
    fontFamily: fontFamilies.primary.regular,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 4,
  },
  field: {
    gap: 6,
  },
  form: {
    gap: 18,
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
