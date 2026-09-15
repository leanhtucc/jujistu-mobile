import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';

export type InputFieldSize = 'sm' | 'md';

export interface InputFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  size?: InputFieldSize;
  error?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
