import { dsTypography, semanticColors } from '@jujistu/shared/theme';
import { AppCard, AppQuantityStepper } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MAX_GENERAL_TICKETS } from '../data/ticket-content';
import { formatVnd } from '../data/ticket-selectors';
import type { Seat, SeatRow, TicketZone } from '../types/ticket.types';

export interface TicketZonePanelProps {
  readonly zone: TicketZone;
  readonly seatRows: readonly SeatRow[];
  readonly quantity: number;
  readonly onToggleSeat: (seatId: string) => void;
  readonly onChangeQuantity: (delta: number) => void;
}

function SeatButton({
  seat,
  onPress,
}: {
  readonly seat: Seat;
  readonly onPress: (seatId: string) => void;
}) {
  const selected = seat.state === 'selected';
  const sold = seat.state === 'sold';

  return (
    <Pressable
      accessibilityLabel={`Ghế ${seat.id}${sold ? ', đã bán' : ''}`}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: sold }}
      onPress={() => onPress(seat.id)}
      style={[
        styles.seat,
        selected ? styles.seatSelected : null,
        sold ? styles.seatSold : null,
      ]}
      testID={`ticket-seat-${seat.id}`}
    >
      <Text style={styles.seatNumber}>{seat.number}</Text>
    </Pressable>
  );
}

export function TicketZonePanel({
  zone,
  seatRows,
  quantity,
  onToggleSeat,
  onChangeQuantity,
}: TicketZonePanelProps) {
  return (
    <AppCard lapel={false} style={styles.card} testID="ticket-zone-panel">
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.title}>
            {zone.generalAdmission
              ? `${zone.name} · ghế tự do`
              : `Chọn ghế · ${zone.name}`}
          </Text>
          <Text style={styles.note}>{zone.note}</Text>
        </View>
        <Text style={styles.price}>{formatVnd(zone.price)}</Text>
      </View>

      {zone.generalAdmission ? (
        <View style={styles.general}>
          <Text style={styles.generalLabel}>Số lượng vé</Text>
          <AppQuantityStepper
            decrementDisabled={quantity <= 1}
            decrementLabel="Bớt vé"
            incrementDisabled={quantity >= MAX_GENERAL_TICKETS}
            incrementLabel="Thêm vé"
            onDecrement={() => onChangeQuantity(-1)}
            onIncrement={() => onChangeQuantity(1)}
            testID="ticket-general-quantity"
            value={quantity}
          />
        </View>
      ) : (
        <View style={styles.seats} testID="ticket-seat-grid">
          <View style={styles.direction}>
            <View style={styles.directionLine} />
            <Text style={styles.directionText}>HƯỚNG THẢM</Text>
            <View style={styles.directionLine} />
          </View>
          {seatRows.map(row => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <View style={styles.group}>
                {row.left.map(seat => (
                  <SeatButton
                    key={seat.id}
                    onPress={onToggleSeat}
                    seat={seat}
                  />
                ))}
              </View>
              <View style={styles.group}>
                {row.right.map(seat => (
                  <SeatButton
                    key={seat.id}
                    onPress={onToggleSeat}
                    seat={seat}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14, padding: 16 },
  head: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  headText: { flex: 1, minWidth: 0 },
  title: { ...dsTypography.bodyStrong, color: semanticColors.text.primary },
  note: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  price: { ...dsTypography.counter, color: semanticColors.text.accent },
  general: {
    alignItems: 'center',
    borderTopColor: semanticColors.stitch.color,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  generalLabel: { ...dsTypography.body, color: semanticColors.text.secondary },
  seats: { gap: 7 },
  direction: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
    paddingLeft: 24,
  },
  directionLine: {
    backgroundColor: semanticColors.action.primary,
    borderRadius: 1,
    flex: 1,
    height: 2,
    opacity: 0.7,
  },
  directionText: {
    ...dsTypography.overline,
    color: semanticColors.text.tertiary,
  },
  row: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  rowLabel: {
    ...dsTypography.counter,
    color: semanticColors.text.tertiary,
    fontSize: 11,
    width: 16,
  },
  group: { flex: 1, flexDirection: 'row', gap: 5 },
  seat: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.surfaceElevated,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: semanticColors.border.strong,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    flex: 1,
    height: 34,
    justifyContent: 'center',
  },
  seatSelected: {
    backgroundColor: semanticColors.action.primary,
    borderColor: semanticColors.action.primary,
  },
  seatSold: { backgroundColor: 'transparent', opacity: 0.3 },
  seatNumber: {
    ...dsTypography.counter,
    color: semanticColors.text.primary,
    fontSize: 11,
    lineHeight: 13,
  },
});
