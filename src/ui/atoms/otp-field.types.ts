import type { StyleProp, ViewStyle } from 'react-native';

export type OtpFieldSize = 'sm' | 'md' | 'lg';
export type OtpFieldStatus = 'neutral' | 'error';

export interface OtpFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  digitCount?: number;
  size?: OtpFieldSize;
  status?: OtpFieldStatus;
  disabled?: boolean;
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
