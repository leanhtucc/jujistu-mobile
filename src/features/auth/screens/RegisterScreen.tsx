import { useAppTheme } from '@jujistu/shared/theme/useAppTheme';
import {
  getResponsiveContentWidth,
  useResponsive,
} from '@jujistu/shared/constants/responsive';
import { AppButton, AppCheckbox, AppInputField } from '@jujistu/ui';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRegister } from '../hooks/use-register';

export function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedConsent, setAcceptedConsent] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const insets = useSafeAreaInsets();
  const responsive = useResponsive();
  const contentWidth = Math.min(600, getResponsiveContentWidth(responsive, 24));
  const theme = useAppTheme();
  const navigation = useNavigation<any>();

  const { register, isSubmitting, error } = useRegister();

  const handleRegister = async () => {
    if (
      !displayName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !acceptedConsent
    ) {
      return;
    }
    try {
      await register({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      });
    } catch {
      // Error is captured in error state
    }
  };

  const isPending = isSubmitting;
  const canSubmit =
    acceptedConsent &&
    Boolean(displayName.trim()) &&
    Boolean(email.trim()) &&
    Boolean(password.trim());

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, { width: contentWidth }]}>
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: theme.colors.text }]}
          >
            Create Account
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Join Jujitsu today
          </Text>

          {Boolean(error) && (
            <View
              accessibilityLiveRegion="polite"
              style={[
                styles.errorBanner,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error?.message || 'Registration failed. Please try again.'}
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Full Name
            </Text>
            <AppInputField
              accessibilityLabel="Full name input"
              containerStyle={styles.inputLayout}
              onChangeText={setDisplayName}
              placeholder="John Doe"
              value={displayName}
            />

            <Text style={[styles.label, { color: theme.colors.text }]}>
              Email
            </Text>
            <AppInputField
              accessibilityLabel="Email input"
              autoCapitalize="none"
              autoComplete="email"
              containerStyle={styles.inputLayout}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="name@example.com"
              value={email}
            />

            <Text style={[styles.label, { color: theme.colors.text }]}>
              Password
            </Text>
            <AppInputField
              accessibilityLabel="Password input"
              autoCapitalize="none"
              containerStyle={styles.inputLayout}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              value={password}
            />

            {/* vn-law-check: Điều 9 Luật 91/2025/QH15 & NĐ 356/2025/NĐ-CP: Consent không được tick sẵn */}
            <View style={styles.consentRow}>
              <AppCheckbox
                accessibilityLabel="Đồng ý điều khoản dịch vụ và chính sách bảo vệ dữ liệu"
                checked={acceptedConsent}
                onValueChange={setAcceptedConsent}
                size="sm"
              />
              <Text
                style={[
                  styles.consentText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Tôi đồng ý với{' '}
                <Text
                  onPress={() => setShowPolicyModal(true)}
                  style={[styles.linkText, { color: theme.colors.primary }]}
                >
                  Điều khoản & Chính sách bảo vệ dữ liệu cá nhân
                </Text>
              </Text>
            </View>

            <Pressable
              accessibilityLabel="Create account"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit || isPending }}
              disabled={!canSubmit || isPending}
              onPress={handleRegister}
              style={[
                styles.button,
                { backgroundColor: theme.colors.primary },
                (!canSubmit || isPending) && styles.buttonDisabled,
              ]}
            >
              {isPending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </Pressable>

            <Pressable
              accessibilityLabel="Navigate to login"
              accessibilityRole="button"
              onPress={() => navigation.navigate('Login')}
              style={styles.switchAuthButton}
            >
              <Text
                style={[
                  styles.switchAuthText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Already have an account?{' '}
                <Text style={{ color: theme.colors.primary }}>Sign In</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Modal Chính sách bảo vệ dữ liệu cá nhân theo vn-law-check */}
      <Modal
        animationType="slide"
        onRequestClose={() => setShowPolicyModal(false)}
        transparent
        visible={showPolicyModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Chính Sách Bảo Vệ Dữ Liệu Cá Nhân
            </Text>
            <ScrollView style={styles.modalScroll}>
              <Text
                style={[
                  styles.policyBody,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định
                356/2025/NĐ-CP:{'\n\n'}
                1. <Text style={{ fontWeight: '700' }}>
                  Mục đích thu thập:
                </Text>{' '}
                Chúng tôi chỉ thu thập email và tên hiển thị nhằm phục vụ việc
                quản lý tài khoản, tích lũy xu thưởng, và tham gia giải đấu.
                {'\n\n'}
                2. <Text style={{ fontWeight: '700' }}>Quyền của bạn:</Text> Bạn
                có quyền yêu cầu xem, chỉnh sửa hoặc{' '}
                <Text style={{ fontWeight: '700' }}>
                  xóa bỏ tài khoản & dữ liệu
                </Text>{' '}
                bất kỳ lúc nào trực tiếp trong ứng dụng.{'\n\n'}
                3.{' '}
                <Text style={{ fontWeight: '700' }}>
                  Thời hạn xử lý xóa dữ liệu:
                </Text>{' '}
                Yêu cầu xóa sẽ được phản hồi tiếp nhận trong 2 ngày làm việc và
                hoàn tất xóa vĩnh viễn trong vòng tối đa 20 ngày theo quy định
                pháp luật Việt Nam.{'\n\n'}
                4. <Text style={{ fontWeight: '700' }}>
                  Đơn vị vận hành:
                </Text>{' '}
                Hệ sinh thái JUJISTU Vietnam. Email hỗ trợ: support@jujistu.vn.
              </Text>
            </ScrollView>
            <AppButton
              label="Đóng"
              onPress={() => setShowPolicyModal(false)}
              size="sm"
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    justifyContent: 'center',
    width: '100%',
  },
  errorBanner: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  errorText: {
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  inputLayout: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  switchAuthButton: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8,
  },
  switchAuthText: {
    fontSize: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  consentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  consentText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    gap: 16,
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 320,
  },
  policyBody: {
    fontSize: 13,
    lineHeight: 20,
  },
});
