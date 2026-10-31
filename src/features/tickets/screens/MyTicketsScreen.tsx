import { dsTypography, semanticColors, spacing } from '@jujistu/shared/theme';
import { AppButton, AppHeader, AppToast } from '@jujistu/ui';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TicketPass, TicketPassActions } from '../components/TicketPass';
import { useTicketPass } from '../hooks/use-ticket-pass';

const CONTENT_MAX_WIDTH = 720;

export interface MyTicketsScreenProps {
  readonly onBack: () => void;
  /** Opens the purchase flow from the empty state. */
  readonly onBuyTicket?: () => void;
}

export function MyTicketsScreen({ onBack, onBuyTicket }: MyTicketsScreenProps) {
  const insets = useSafeAreaInsets();
  const pass = useTicketPass();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader
        backAccessibilityLabel="Quay lại"
        onBackPress={onBack}
        title="Vé của tôi"
      />
      {pass.ticket ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.column}>
            <TicketPass pass={pass} />
            <TicketPassActions pass={pass} />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.empty} testID="my-tickets-empty">
          <Text style={styles.emptyTitle}>Bạn chưa có vé nào</Text>
          <Text style={styles.emptyBody}>
            Vé điện tử sẽ xuất hiện ở đây sau khi bạn thanh toán.
          </Text>
          {onBuyTicket ? (
            <View style={styles.emptyAction}>
              <AppButton label="Mua vé" onPress={onBuyTicket} />
            </View>
          ) : null}
        </View>
      )}

      {pass.notice ? (
        <View pointerEvents="none" style={styles.toast}>
          <AppToast
            message={pass.notice}
            status="neutral"
            styleVariant="style2"
            visible
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: semanticColors.background.canvas, flex: 1 },
  content: { alignItems: 'center', paddingBottom: 24, paddingTop: 8 },
  column: {
    gap: 16,
    maxWidth: CONTENT_MAX_WIDTH,
    paddingHorizontal: spacing.gutter,
    width: '100%',
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: { ...dsTypography.title, color: semanticColors.text.primary },
  emptyBody: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyAction: { marginTop: 20, width: 160 },
  toast: {
    bottom: 24,
    left: spacing.gutter,
    position: 'absolute',
    right: spacing.gutter,
  },
});
