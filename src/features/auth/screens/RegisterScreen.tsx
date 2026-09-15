import { useAppTheme } from '@jujistu/shared/theme/useAppTheme';
import { AppInputField } from '@jujistu/ui';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRegisterMutation } from '../queries/use-register-mutation';

export function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const navigation = useNavigation<any>();

  const registerMutation = useRegisterMutation();

  const handleRegister = () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      return;
    }
    registerMutation.mutate({
      displayName: displayName.trim(),
      email: email.trim(),
      password,
    });
  };

  const isPending = registerMutation.isPending;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.content}>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: theme.colors.text }]}
        >
          Create Account
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Join Jujitsu today
        </Text>

        {registerMutation.isError && (
          <View
            accessibilityLiveRegion="polite"
            style={[
              styles.errorBanner,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {registerMutation.error?.message ||
                'Registration failed. Please try again.'}
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

          <Pressable
            accessibilityLabel="Create account"
            accessibilityRole="button"
            accessibilityState={{ disabled: isPending }}
            disabled={isPending}
            onPress={handleRegister}
            style={[
              styles.button,
              { backgroundColor: theme.colors.primary },
              isPending && styles.buttonDisabled,
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
    </View>
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
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
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
});
