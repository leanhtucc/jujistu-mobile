import { dsTypography, semanticColors, spacing } from '@jujistu/shared/theme';
import { AppButton, AppHeader, AppToast } from '@jujistu/ui';
import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TicketConfirmSheet } from '../components/TicketConfirmSheet';
import { TicketPass, TicketPassActions } from '../components/TicketPass';
import { TicketSeatMap } from '../components/TicketSeatMap';
import { TicketSessionPicker } from '../components/TicketSessionPicker';
import { TicketZonePanel } from '../components/TicketZonePanel';
import { usePurchasedTicket } from '../data/ticket-store';
import { useTicketPass } from '../hooks/use-ticket-pass';
import { useTicketPurchase } from '../hooks/use-ticket-purchase';
import type { ZoneId } from '../types/ticket.types';

const CONTENT_MAX_WIDTH = 720;

export interface TicketPurchaseScreenProps {
  readonly tournamentId?: string;
  /** Stand preselected when opened from a shop ticket product. */
  readonly initialZone?: ZoneId;
  readonly onBack: () => void;
  readonly onOpenMyTickets?: () => void;
  /** Leaves the flow after the ticket has been issued. */
  readonly onGoHome?: () => void;
}

export function TicketPurchaseScreen({
  tournamentId: _tournamentId,
  initialZone,
  onBack,
  onOpenMyTickets,
  onGoHome,
}: TicketPurchaseScreenProps) {
  const insets = useSafeAreaInsets();
  const purchase = useTicketPurchase({ initialZone });
  const pass = useTicketPass();
  const hasTicket = usePurchasedTicket() !== null;
  const done = purchase.stage === 'done';
  const notice = purchase.notice ?? pass.notice;
  const scrollRef = useRef<ScrollViewInstance>(null);

  // The pass is shorter than the seat map; start it from the top.
  useEffect(() => {
    if (done) {
      scrollRef.current?.scrollTo({ animated: false, y: 0 });
    }
  }, [done]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader
        backAccessibilityLabel="Quay lại"
        onBackPress={onBack}
        title={done ? 'Vé của bạn' : 'Mua vé'}
        trailingAction={
          !done && hasTicket && onOpenMyTickets
            ? {
                icon: 'ticket',
                onPress: onOpenMyTickets,
                accessibilityLabel: 'Vé của tôi',
              }
            : undefined
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        testID="ticket-scroll"
      >
        <View style={styles.column}>
          {done ? (
            <View style={styles.gutter}>
              <TicketPass pass={pass} />
              <View style={styles.actions}>
                <TicketPassActions pass={pass} />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.gutter}>
                <Text style={styles.overline}>{purchase.event.venueShort}</Text>
                <Text accessibilityRole="header" style={styles.title}>
                  {purchase.event.name}
                </Text>
                <Text style={styles.from}>
                  Từ {purchase.priceFromLabel} / vé
                </Text>
              </View>

              <View style={styles.gutter}>
                <TicketSessionPicker
                  activeIndex={purchase.sessionIndex}
                  onSelect={purchase.selectSession}
                  sessions={purchase.sessions}
                />
              </View>

              <View style={[styles.gutter, styles.section]}>
                <Text style={styles.sectionTitle}>Sơ đồ khán đài</Text>
                <TicketSeatMap
                  onSelectZone={purchase.selectZone}
                  zones={purchase.zones}
                />
              </View>

              <View style={styles.gutter}>
                <TicketZonePanel
                  onChangeQuantity={purchase.changeGeneralQuantity}
                  onToggleSeat={purchase.toggleSeat}
                  quantity={purchase.quantity}
                  seatRows={purchase.seatRows}
                  zone={purchase.zone}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}
        testID="ticket-footer"
      >
        {done ? (
          <AppButton
            icon="house"
            iconPosition="trailing"
            label="Về trang chủ"
            onPress={() => onGoHome?.()}
            size="lg"
          />
        ) : (
          <>
            <View style={styles.summary}>
              <Text numberOfLines={1} style={styles.summaryLeft}>
                {purchase.summaryLeft}
              </Text>
              <Text style={styles.summaryRight}>{purchase.summaryRight}</Text>
            </View>
            <AppButton
              beltTip
              disabled={!purchase.canContinue}
              label={purchase.continueLabel}
              onPress={purchase.openConfirm}
              size="lg"
            />
          </>
        )}
      </View>

      <TicketConfirmSheet
        method={purchase.paymentMethod}
        methods={purchase.paymentMethods}
        onClose={purchase.closeConfirm}
        onPay={purchase.pay}
        onSelectMethod={purchase.selectPaymentMethod}
        payLabel={purchase.payLabel}
        paying={purchase.paying}
        rows={purchase.summaryRows}
        total={purchase.totalLabel}
        visible={purchase.confirmOpen}
      />

      {notice ? (
        <View pointerEvents="none" style={styles.toast} testID="ticket-notice">
          <AppToast
            message={notice}
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
  content: { alignItems: 'center', paddingBottom: 24, paddingTop: 6 },
  column: { gap: 24, maxWidth: CONTENT_MAX_WIDTH, width: '100%' },
  gutter: { paddingHorizontal: spacing.gutter },
  overline: { ...dsTypography.overline, color: semanticColors.text.accent },
  title: {
    ...dsTypography.title,
    color: semanticColors.text.primary,
    marginTop: 6,
  },
  from: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  section: { gap: 12 },
  sectionTitle: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.primary,
  },
  actions: { marginTop: 16 },
  footer: {
    backgroundColor: semanticColors.background.canvas,
    gap: 10,
    paddingHorizontal: spacing.gutter,
    paddingTop: 12,
  },
  summary: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  summaryLeft: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  summaryRight: { ...dsTypography.counter, color: semanticColors.text.primary },
  toast: {
    bottom: 120,
    left: spacing.gutter,
    position: 'absolute',
    right: spacing.gutter,
  },
});
