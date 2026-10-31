import { dsTypography, semanticColors, spacing } from '@jujistu/shared/theme';
import { AppButton, AppChip, AppHeader } from '@jujistu/ui';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TournamentHeroCard } from '../components/TournamentHeroCard';
import { TournamentInfoCard } from '../components/TournamentInfoCard';
import { TournamentMedalTableTab } from '../components/TournamentMedalTableTab';
import { TournamentResultsTab } from '../components/TournamentResultsTab';
import { TournamentScheduleTab } from '../components/TournamentScheduleTab';
import { useTournamentDetail } from '../hooks/use-tournament-detail';

const CONTENT_MAX_WIDTH = 720;

export interface TournamentDetailScreenProps {
  readonly tournamentId: string;
  /** The bracket tab is not part of Phase 1 and falls back to the schedule. */
  readonly initialTab?: 'Lịch thi đấu' | 'Kết quả' | 'Tổng sắp' | 'Nhánh đấu';
  readonly onBack: () => void;
  readonly onPressAthlete?: (athleteId: string) => void;
  /** Opens the live stream or the replay. */
  readonly onPressWatch?: () => void;
}

export function TournamentDetailScreen({
  tournamentId,
  initialTab,
  onBack,
  onPressAthlete,
  onPressWatch,
}: TournamentDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const detail = useTournamentDetail({ tournamentId, initialTab });
  const { tournament, cta } = detail;

  const handleCtaPress = () => {
    if (cta.kind === 'remind') {
      detail.toggleReminder();
    } else {
      onPressWatch?.();
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader
        backAccessibilityLabel="Quay lại"
        onBackPress={onBack}
        title={tournament?.shortName ?? 'Chi tiết giải đấu'}
      />

      {tournament === null ? (
        <View style={styles.empty} testID="tournament-not-found">
          <Text style={styles.emptyTitle}>Không tìm thấy giải đấu</Text>
          <Text style={styles.emptyBody}>
            Giải này có thể đã bị gỡ khỏi lịch giải.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.column}>
              <View style={styles.gutter}>
                <TournamentHeroCard
                  dateRange={detail.dateRange}
                  status={detail.status}
                  statusLabel={detail.statusLabel}
                  tournament={tournament}
                />
              </View>

              {tournament.hasFullDetail ? (
                <>
                  <ScrollView
                    contentContainerStyle={styles.chips}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.chipScroll}
                  >
                    {detail.tabs.map(tab => (
                      <AppChip
                        key={tab}
                        label={tab}
                        onPress={() => detail.selectTab(tab)}
                        selected={tab === detail.activeTab}
                        testID={`tournament-tab-${tab}`}
                      />
                    ))}
                  </ScrollView>

                  <View style={styles.gutter}>
                    {detail.activeTab === 'Lịch thi đấu' ? (
                      <TournamentScheduleTab
                        activeDay={detail.activeDay}
                        days={detail.days}
                        onPressAthlete={onPressAthlete}
                        onPressWatch={onPressWatch}
                        onSelectDay={detail.selectDay}
                        sessions={detail.sessions}
                        todayIndex={detail.todayIndex}
                      />
                    ) : null}
                    {detail.activeTab === 'Kết quả' ? (
                      <TournamentResultsTab
                        onPressAthlete={onPressAthlete}
                        results={detail.results}
                      />
                    ) : null}
                    {detail.activeTab === 'Tổng sắp' ? (
                      <TournamentMedalTableTab rows={detail.medalTable} />
                    ) : null}
                  </View>
                </>
              ) : (
                <View style={styles.gutter}>
                  <TournamentInfoCard
                    note={detail.briefNote}
                    rows={detail.infoRows}
                  />
                </View>
              )}
            </View>
          </ScrollView>

          <View
            style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}
            testID="tournament-cta"
          >
            <AppButton
              accessibilityLabel={cta.label}
              beltTip
              icon={
                cta.kind === 'remind'
                  ? detail.reminded
                    ? 'bellRinging'
                    : 'bellPhosphor'
                  : 'youtubeLogo'
              }
              iconPosition="trailing"
              label={cta.label}
              onPress={handleCtaPress}
              size="lg"
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: semanticColors.background.canvas, flex: 1 },
  content: { alignItems: 'center', paddingBottom: 24, paddingTop: 4 },
  column: { gap: 18, maxWidth: CONTENT_MAX_WIDTH, width: '100%' },
  gutter: { paddingHorizontal: spacing.gutter },
  chipScroll: { flexGrow: 0 },
  chips: { gap: 8, paddingHorizontal: spacing.gutter, paddingVertical: 2 },
  footer: {
    backgroundColor: semanticColors.background.canvas,
    paddingHorizontal: spacing.gutter,
    paddingTop: 12,
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
});
