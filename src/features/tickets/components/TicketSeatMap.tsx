import {
  dsTypography,
  primitiveColors,
  radius,
  semanticColors,
} from '@jujistu/shared/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ZoneAvailability, ZoneId } from '../types/ticket.types';

export interface TicketSeatMapProps {
  readonly zones: readonly ZoneAvailability[];
  readonly onSelectZone: (zoneId: ZoneId) => void;
}

function find(zones: readonly ZoneAvailability[], id: ZoneId) {
  return zones.find(item => item.zone.id === id) as ZoneAvailability;
}

function zoneColors(item: ZoneAvailability) {
  return {
    borderColor: item.soldOut
      ? semanticColors.border.strong
      : item.selected
      ? semanticColors.border.accent
      : semanticColors.border.subtle,
    backgroundColor: item.soldOut
      ? 'transparent'
      : item.selected
      ? semanticColors.background.accentTint
      : semanticColors.background.surfaceElevated,
    color: item.soldOut
      ? semanticColors.text.tertiary
      : item.selected
      ? semanticColors.text.accent
      : semanticColors.text.primary,
    stateColor: item.soldOut
      ? semanticColors.text.tertiary
      : item.urgent
      ? semanticColors.text.accent
      : semanticColors.text.tertiary,
  };
}

function ZoneButton({
  item,
  onPress,
  children,
  style,
}: {
  readonly item: ZoneAvailability;
  readonly onPress: (zoneId: ZoneId) => void;
  readonly children: React.ReactNode;
  readonly style: object;
}) {
  const colors = zoneColors(item);

  return (
    <Pressable
      accessibilityLabel={`${item.zone.name}, ${item.stateLabel}`}
      accessibilityRole="button"
      accessibilityState={{ selected: item.selected, disabled: item.soldOut }}
      onPress={() => onPress(item.zone.id)}
      style={({ pressed }) => [
        styles.zone,
        style,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          transform: [{ scale: pressed ? 0.96 : item.selected ? 1.02 : 1 }],
        },
        item.soldOut ? styles.zoneSoldOut : null,
      ]}
      testID={`ticket-zone-${item.zone.id}`}
    >
      {children}
    </Pressable>
  );
}

function SideZone({
  item,
  letter,
  onPress,
  style,
}: {
  readonly item: ZoneAvailability;
  readonly letter: string;
  readonly onPress: (zoneId: ZoneId) => void;
  readonly style: object;
}) {
  const colors = zoneColors(item);

  return (
    <ZoneButton item={item} onPress={onPress} style={[styles.side, style]}>
      <Text style={[styles.sideLetter, { color: colors.color }]}>{letter}</Text>
      <Text style={[styles.sidePrice, { color: colors.color }]}>
        {Math.round(item.zone.price / 1000)}K
      </Text>
      <Text style={[styles.sideState, { color: colors.stateColor }]}>
        {item.stateLabel}
      </Text>
    </ZoneButton>
  );
}

export function TicketSeatMap({ zones, onSelectZone }: TicketSeatMapProps) {
  const a = find(zones, 'a');
  const b = find(zones, 'b');
  const c = find(zones, 'c');
  const vip = find(zones, 'vip');
  const aColors = zoneColors(a);
  const vipColors = zoneColors(vip);

  return (
    <View style={styles.root} testID="ticket-seat-map">
      <ZoneButton item={a} onPress={onSelectZone} style={styles.top}>
        <View style={styles.topText}>
          <Text style={[styles.topName, { color: aColors.color }]}>
            {a.zone.name}
          </Text>
          <Text style={styles.topHint}>CHÍNH DIỆN · GHẾ SỐ</Text>
        </View>
        <View style={styles.topRight}>
          <Text style={[styles.topPrice, { color: aColors.color }]}>
            {Math.round(a.zone.price / 1000)}K
          </Text>
          <Text style={[styles.sideState, { color: aColors.stateColor }]}>
            {a.stateLabel}
          </Text>
        </View>
      </ZoneButton>

      <View style={styles.middle}>
        <SideZone
          item={b}
          letter="B"
          onPress={onSelectZone}
          style={styles.leftSide}
        />
        <ZoneButton item={vip} onPress={onSelectZone} style={styles.vip}>
          <View style={styles.vipHead}>
            <Text style={[styles.vipTitle, { color: vipColors.color }]}>
              VIP SÁT THẢM
            </Text>
            <Text style={[styles.sideState, { color: vipColors.stateColor }]}>
              {vip.stateLabel}
            </Text>
          </View>
          <View style={styles.matWrap}>
            <View style={styles.matFrame}>
              <View style={styles.mat}>
                <Text style={styles.matLabel}>THẢM 1</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.vipPrice, { color: vipColors.color }]}>
            {Math.round(vip.zone.price / 1000)}K
          </Text>
        </ZoneButton>
        <SideZone
          item={c}
          letter="C"
          onPress={onSelectZone}
          style={styles.rightSide}
        />
      </View>

      <View style={styles.referee}>
        <Text style={styles.refereeText}>BÀN TRỌNG TÀI · CAMERA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.subtle,
    borderRadius: radius.banner,
    borderWidth: 1,
    gap: 6,
    padding: 10,
  },
  zone: { borderWidth: 1 },
  zoneSoldOut: { borderStyle: 'dashed' },
  top: {
    alignItems: 'center',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    height: 62,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  topText: { gap: 3 },
  topName: { ...dsTypography.bodyStrong, fontSize: 15 },
  topHint: { ...dsTypography.overline, color: semanticColors.text.tertiary },
  topRight: { alignItems: 'flex-end', gap: 3 },
  topPrice: { ...dsTypography.counter, fontSize: 13 },
  middle: { flexDirection: 'row', gap: 6, height: 184 },
  side: {
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    width: 54,
  },
  leftSide: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 6,
  },
  rightSide: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 12,
  },
  sideLetter: { ...dsTypography.stat, fontSize: 22, lineHeight: 24 },
  sidePrice: { ...dsTypography.counter, fontSize: 11, lineHeight: 12 },
  sideState: { ...dsTypography.overline, fontSize: 9, lineHeight: 11 },
  vip: { borderRadius: 8, flex: 1, gap: 8, padding: 10 },
  vipHead: { flexDirection: 'row', justifyContent: 'space-between' },
  vipTitle: dsTypography.overline,
  matWrap: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  matFrame: {
    backgroundColor: primitiveColors.red[700],
    borderRadius: 4,
    height: 96,
    padding: 10,
    width: 96,
  },
  mat: {
    alignItems: 'center',
    backgroundColor: primitiveColors.red[500],
    borderRadius: 2,
    flex: 1,
    justifyContent: 'center',
  },
  matLabel: { ...dsTypography.overline, color: primitiveColors.gi[100] },
  vipPrice: { ...dsTypography.counter, fontSize: 12, textAlign: 'center' },
  referee: {
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderColor: semanticColors.border.default,
    borderRadius: 6,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
  },
  refereeText: {
    ...dsTypography.overline,
    color: semanticColors.text.tertiary,
  },
});
