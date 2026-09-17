import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';

export type InputFieldSize = 'sm' | 'md' | 'lg';
export type InputFieldStatus = 'neutral' | 'error';

export interface InputFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  size?: InputFieldSize;
  status?: InputFieldStatus;
  error?: boolean;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  accessibilityLabel?: string;
  autoFocus?: boolean;
  onBlur?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}
