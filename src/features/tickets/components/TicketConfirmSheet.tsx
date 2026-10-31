import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import { AppBottomSheet, AppButton, AppChip } from '@jujistu/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MOCK_CONTACT_EMAIL } from '../data/ticket-content';
import type { SummaryRow } from '../hooks/use-ticket-purchase';
import type { PaymentMethod } from '../types/ticket.types';

export interface TicketConfirmSheetProps {
  readonly visible: boolean;
  readonly rows: readonly SummaryRow[];
  readonly total: string;
  readonly methods: readonly PaymentMethod[];
  readonly method: PaymentMethod;
  readonly paying: boolean;
  readonly payLabel: string;
  readonly onClose: () => void;
  readonly onSelectMethod: (method: PaymentMethod) => void;
  readonly onPay: () => void;
}

export function TicketConfirmSheet({
  visible,
  rows,
  total,
  methods,
  method,
  paying,
  payLabel,
  onClose,
  onSelectMethod,
  onPay,
}: TicketConfirmSheetProps) {
  return (
    <AppBottomSheet
      onClose={onClose}
      testID="ticket-confirm-sheet"
      title="Xác nhận đặt vé"
      visible={visible}
    >
      <View style={styles.content}>
        <View>
          {rows.map(row => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue} testID="ticket-total">
              {total}
            </Text>
          </View>
        </View>

        <View style={styles.methods}>
          <Text style={styles.methodsLabel}>THANH TOÁN QUA</Text>
          <View style={styles.methodChips}>
            {methods.map(item => (
              <AppChip
                key={item}
                label={item}
                onPress={() => onSelectMethod(item)}
                selected={item === method}
                testID={`ticket-pay-${item}`}
              />
            ))}
          </View>
        </View>

        <Text style={styles.terms}>
          Vé điện tử được gửi về ứng dụng và email {MOCK_CONTACT_EMAIL}. Vé
          không đổi trả sau khi thanh toán.
        </Text>

        <AppButton
          beltTip
          disabled={paying}
          label={payLabel}
          onPress={onPay}
          size="lg"
        />
      </View>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16 },
  row: {
    borderBottomColor: semanticColors.stitch.color,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowLabel: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 18,
  },
  rowValue: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.primary,
    flexShrink: 1,
    fontSize: 13,
    textAlign: 'right',
  },
  total: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  totalLabel: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.primary,
  },
  totalValue: {
    ...dsTypography.counter,
    color: semanticColors.text.primary,
    fontSize: 20,
    lineHeight: 22,
  },
  methods: { gap: 8 },
  methodsLabel: {
    ...dsTypography.overline,
    color: semanticColors.text.tertiary,
  },
  methodChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  terms: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
});
