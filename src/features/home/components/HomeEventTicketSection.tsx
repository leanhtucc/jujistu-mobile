import { primitiveColors } from '@jujistu/shared/theme';
import { AppIcon, AppPressable } from '@jujistu/ui';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  HOME_TICKET_SESSIONS,
  type HomeEventItem,
  type TicketSession,
} from '../data/home-content';

export function resolveHomeEventCardWidth(windowWidth: number): number {
  return Math.min(715, Math.max(0, windowWidth - 31));
}

export interface HomeEventTicketSectionProps {
  readonly sessions?: ReadonlyArray<TicketSession>;
  readonly onPressChooseSeat?: (session: TicketSession) => void;
  readonly onPressEvent?: (event: HomeEventItem) => void;
}

export function HomeEventTicketSection({
  sessions = HOME_TICKET_SESSIONS,
  onPressChooseSeat,
  onPressEvent,
}: HomeEventTicketSectionProps) {
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  const activeSession = sessions[selectedSessionIndex] ?? sessions[0];

  const handleSelectSeat = () => {
    if (activeSession) {
      onPressChooseSeat?.(activeSession);
      onPressEvent?.({
        id: activeSession.id,
        image: require('../../../../assets/image/events/cup_hanoi_arena.jpg'),
        ticketImage: require('../../../../assets/image/events/event-ticket.png'),
        title: activeSession.title,
      });
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vé vào sân</Text>
        <Text style={styles.headerSubtitle}>TRỊNH HOÀI ĐỨC · HÀ NỘI</Text>
      </View>

      {/* Date Sessions horizontal selector */}
      <ScrollView
        contentContainerStyle={styles.sessionsScrollContent}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sessionsScroll}
      >
        {sessions.map((sess, index) => {
          const isSelected = index === selectedSessionIndex;
          return (
            <AppPressable
              accessibilityLabel={`${sess.date} - ${sess.shortKind}`}
              accessibilityRole="button"
              key={sess.id}
              onPress={() => setSelectedSessionIndex(index)}
              style={({ pressed }) => [
                styles.sessionChip,
                isSelected && styles.sessionChipSelected,
                pressed && styles.sessionChipPressed,
                { transform: [{ rotate: isSelected ? '-1.2deg' : '0deg' }] },
              ]}
            >
              <Text
                style={[styles.chipDate, isSelected && styles.chipDateSelected]}
              >
                {sess.date} · {sess.dayOfWeek}
              </Text>
              <Text
                style={[styles.chipKind, isSelected && styles.chipKindSelected]}
              >
                {sess.shortKind}
              </Text>
            </AppPressable>
          );
        })}
      </ScrollView>

      {/* Voucher Ticket Card */}
      {activeSession && (
        <View style={styles.voucherContainer}>
          <AppPressable
            accessibilityLabel={`Chọn chỗ cho ${activeSession.title}`}
            accessibilityRole="button"
            onPress={handleSelectSeat}
            style={({ pressed }) => [
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
          >
            <View style={styles.voucherCard}>
              {/* Left section: Session details + Zone progress bars */}
              <View style={styles.voucherLeft}>
                <View>
                  <Text style={styles.ticketOverline}>
                    {activeSession.date} · MỞ CỬA {activeSession.openTime} · THI
                    ĐẤU {activeSession.time}
                  </Text>
                  <Text numberOfLines={1} style={styles.ticketTitle}>
                    {activeSession.title}
                  </Text>
                  <Text numberOfLines={1} style={styles.ticketMeta}>
                    {activeSession.venue}
                  </Text>
                </View>

                {/* Zones */}
                <View style={styles.zonesList}>
                  {activeSession.zones.map(zone => (
                    <View key={zone.name} style={styles.zoneRow}>
                      <Text numberOfLines={1} style={styles.zoneName}>
                        {zone.name}
                      </Text>
                      {/* Progress track */}
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressBar,
                            {
                              width: `${zone.percent}%`,
                              backgroundColor: zone.isLow
                                ? primitiveColors.red[500]
                                : primitiveColors.neutral[300],
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.zoneCount,
                          zone.isLow && styles.zoneCountLow,
                        ]}
                      >
                        CÒN {zone.left}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Right section: Price & Action */}
              <View style={styles.voucherRight}>
                <Text style={styles.fromLabel}>TỪ</Text>
                <Text style={styles.priceAmount}>
                  {activeSession.fromPrice.toLocaleString('vi-VN')}
                </Text>
                <Text style={styles.unitLabel}>đ / VÉ</Text>

                <View style={styles.chooseAction}>
                  <Text style={styles.chooseText}>CHỌN CHỖ</Text>
                  <AppIcon
                    color={primitiveColors.orange[500]}
                    name="arrowRight"
                    size={10}
                  />
                </View>
              </View>

              {/* Absolute dashed divider and notches */}
              <View pointerEvents="none" style={styles.dashedLine} />
              <View pointerEvents="none" style={styles.notchTop} />
              <View pointerEvents="none" style={styles.notchBottom} />
            </View>
          </AppPressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: primitiveColors.neutral[0],
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: primitiveColors.neutral[300],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  sessionsScroll: {
    flexGrow: 0,
  },
  sessionsScrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  sessionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    gap: 2,
  },
  sessionChipSelected: {
    borderColor: primitiveColors.orange[500],
    backgroundColor: primitiveColors.neutral[800],
  },
  sessionChipPressed: {
    opacity: 0.85,
  },
  chipDate: {
    color: primitiveColors.neutral[300],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  chipDateSelected: {
    color: primitiveColors.orange[500],
  },
  chipKind: {
    color: primitiveColors.neutral[200],
    fontSize: 13,
    fontWeight: '600',
  },
  chipKindSelected: {
    color: primitiveColors.orange[500],
  },
  voucherContainer: {
    paddingHorizontal: 16,
  },
  voucherCard: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: primitiveColors.neutral[850],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  voucherCardPressed: {
    backgroundColor: primitiveColors.neutral[800],
  },
  voucherLeft: {
    flex: 1,
    padding: 14,
    gap: 12,
    minWidth: 0,
  },
  ticketOverline: {
    color: primitiveColors.orange[500],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  ticketTitle: {
    color: primitiveColors.neutral[0],
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: 2,
  },
  ticketMeta: {
    color: primitiveColors.neutral[300],
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  zonesList: {
    gap: 6,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoneName: {
    width: 82,
    color: primitiveColors.neutral[200],
    fontSize: 11,
    fontWeight: '600',
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  zoneCount: {
    width: 50,
    textAlign: 'right',
    color: primitiveColors.neutral[200],
    fontSize: 10,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  zoneCountLow: {
    color: primitiveColors.red[500],
  },
  dashedLine: {
    position: 'absolute',
    top: 14,
    bottom: 14,
    right: 104,
    width: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  notchTop: {
    position: 'absolute',
    top: -9,
    right: 95,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: primitiveColors.neutral[900],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
  },
  notchBottom: {
    position: 'absolute',
    bottom: -9,
    right: 95,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: primitiveColors.neutral[900],
    borderWidth: 1,
    borderColor: primitiveColors.alpha.white10,
  },
  voucherRight: {
    width: 104,
    backgroundColor: primitiveColors.neutral[800],
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 2,
  },
  fromLabel: {
    color: primitiveColors.neutral[300],
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  priceAmount: {
    color: primitiveColors.neutral[0],
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  unitLabel: {
    color: primitiveColors.neutral[300],
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  chooseAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  chooseText: {
    color: primitiveColors.orange[500],
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
