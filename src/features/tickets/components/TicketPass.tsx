import {
  dsTypography,
  primitiveColors,
  semanticColors,
} from '@jujistu/shared/theme';
import { AppButton, AppStampIn } from '@jujistu/ui';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import type { UseTicketPassResult } from '../hooks/use-ticket-pass';

const QR_SIZE = 21;

export interface TicketPassProps {
  readonly pass: UseTicketPassResult;
}

function Qr({ cells }: { readonly cells: readonly boolean[] }) {
  return (
    <View style={styles.qrFrame} testID="ticket-qr">
      <Svg
        accessibilityLabel="Mã QR vào cổng"
        height="100%"
        viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
        width="100%"
      >
        {cells.map((on, index) =>
          on ? (
            <Rect
              fill={semanticColors.text.inverse}
              height={1}
              key={index}
              width={1}
              x={index % QR_SIZE}
              y={Math.floor(index / QR_SIZE)}
            />
          ) : null,
        )}
      </Svg>
    </View>
  );
}

export function TicketPass({ pass }: TicketPassProps) {
  const { ticket } = pass;
  if (!ticket) {
    return null;
  }

  return (
    <View style={styles.root} testID="ticket-pass">
      <View style={styles.top}>
        <View style={styles.topText}>
          <Text style={styles.event}>{pass.eventCaps}</Text>
          <Text style={styles.kind}>{ticket.kind}</Text>
          <Text style={styles.venue}>{pass.venue}</Text>
        </View>
        <View style={styles.info}>
          {pass.infoRows.map(row => (
            <View key={row.label} style={styles.infoCell}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>
        <AppStampIn delay={350} style={styles.stampSlot}>
          <View style={styles.stamp}>
            <Text style={styles.stampText}>{'ĐÃ THANH\nTOÁN'}</Text>
          </View>
        </AppStampIn>
      </View>

      <View style={styles.tear}>
        <View style={styles.tearLine} />
        <View style={[styles.notch, styles.notchLeft]} />
        <View style={[styles.notch, styles.notchRight]} />
      </View>

      <View style={styles.bottom}>
        <Qr cells={pass.cells} />
        <View style={styles.bottomText}>
          <View>
            <Text style={styles.infoLabel}>{pass.counterLabel}</Text>
            <Text style={styles.code}>{pass.code}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>GHẾ</Text>
            <View style={styles.seats}>
              {ticket.seats.map((label, index) => {
                const selected = index === pass.seatIndex;
                return (
                  <Pressable
                    accessibilityLabel={`Xem mã vé ${label}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={label}
                    onPress={() => pass.selectSeat(index)}
                    style={[styles.seat, selected ? styles.seatSelected : null]}
                    testID={`ticket-pass-seat-${index}`}
                  >
                    <Text
                      style={[
                        styles.seatText,
                        {
                          color: selected
                            ? primitiveColors.gi[100]
                            : semanticColors.text.inverse,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export function TicketPassActions({ pass }: TicketPassProps) {
  return (
    <View style={styles.actions}>
      <Text style={styles.note}>{pass.note}</Text>
      <View style={styles.actionRow}>
        <View style={styles.action}>
          <AppButton
            appearance="soft"
            label="Lưu vé"
            onPress={pass.save}
            variant="secondaryDark"
          />
        </View>
        <View style={styles.action}>
          <AppButton
            appearance="soft"
            label="Chỉ đường"
            onPress={pass.openMap}
            variant="secondaryDark"
          />
        </View>
      </View>
    </View>
  );
}

const INK_MUTED = primitiveColors.neutral[550];

const styles = StyleSheet.create({
  root: {
    backgroundColor: semanticColors.background.gi,
    borderRadius: 18,
  },
  top: { gap: 16, paddingBottom: 14, paddingHorizontal: 18, paddingTop: 20 },
  topText: { paddingRight: 96 },
  event: { ...dsTypography.overline, color: semanticColors.action.primary },
  kind: {
    ...dsTypography.title,
    color: semanticColors.text.inverse,
    marginTop: 6,
  },
  venue: {
    ...dsTypography.body,
    color: INK_MUTED,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  info: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 },
  infoCell: { width: '50%' },
  infoLabel: { ...dsTypography.overline, color: INK_MUTED },
  infoValue: {
    ...dsTypography.bodyStrong,
    color: semanticColors.text.inverse,
    marginTop: 4,
  },
  stampSlot: { position: 'absolute', right: 14, top: 18 },
  stamp: {
    borderColor: semanticColors.action.primary,
    borderRadius: 6,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 7,
    transform: [{ rotate: '-7deg' }],
  },
  stampText: {
    ...dsTypography.counter,
    color: semanticColors.action.primary,
    fontSize: 10,
    letterSpacing: 1.2,
    lineHeight: 12,
    textAlign: 'center',
  },
  tear: { height: 24 },
  tearLine: {
    backgroundColor: primitiveColors.alpha.black40,
    height: 1,
    left: 18,
    opacity: 0.4,
    position: 'absolute',
    right: 18,
    top: 11,
  },
  notch: {
    backgroundColor: semanticColors.background.canvas,
    borderRadius: 12,
    height: 24,
    position: 'absolute',
    top: 0,
    width: 24,
  },
  notchLeft: { left: -12 },
  notchRight: { right: -12 },
  bottom: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 20,
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  qrFrame: {
    aspectRatio: 1,
    backgroundColor: primitiveColors.neutral[0],
    borderRadius: 10,
    padding: 8,
    width: 132,
  },
  bottomText: { flex: 1, gap: 12, minWidth: 0 },
  code: {
    ...dsTypography.counter,
    color: semanticColors.text.inverse,
    marginTop: 4,
  },
  seats: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  seat: {
    alignItems: 'center',
    borderColor: primitiveColors.alpha.black40,
    borderRadius: 4,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    minWidth: 44,
    paddingHorizontal: 8,
  },
  seatSelected: {
    backgroundColor: semanticColors.text.inverse,
    borderColor: semanticColors.text.inverse,
    transform: [{ rotate: '-2deg' }],
  },
  seatText: { ...dsTypography.counter },
  actions: { gap: 16 },
  note: {
    ...dsTypography.body,
    color: semanticColors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  actionRow: { flexDirection: 'row', gap: 10 },
  action: { flex: 1 },
});
