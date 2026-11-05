import { dsTypography, semanticColors, spacing } from '@jujistu/shared/theme';
import { AppButton, AppChip, AppHeader } from '@jujistu/ui';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AthleteCareerTimeline } from '../components/AthleteCareerTimeline';
import { AthleteProfileHero } from '../components/AthleteProfileHero';
import { AthleteRivalsList } from '../components/AthleteRivalsList';
import { AthleteStatsSection } from '../components/AthleteStatsSection';
import { FEATURED_ATHLETE_ID } from '../data/athlete-content';
import { useAthleteProfile } from '../hooks/use-athlete-profile';

const CONTENT_MAX_WIDTH = 720;

export interface AthleteJourneyScreenProps {
  readonly athleteId?: string;
  readonly onBack: () => void;
  /** Opens the match video player. */
  readonly onPressVideo?: () => void;
}

export function AthleteJourneyScreen({
  athleteId = FEATURED_ATHLETE_ID,
  onBack,
  onPressVideo,
}: AthleteJourneyScreenProps) {
  const insets = useSafeAreaInsets();
  const journey = useAthleteProfile({ athleteId });
  const { athlete, profile } = journey;

  if (athlete === null || profile === null) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <AppHeader
          backAccessibilityLabel="Quay lại"
          onBackPress={onBack}
          title="Hành trình VĐV"
        />
        <View style={styles.empty} testID="athlete-not-found">
          <Text style={styles.emptyTitle}>
            {athlete ? 'Hồ sơ đang được cập nhật' : 'Không tìm thấy VĐV'}
          </Text>
          <Text style={styles.emptyBody}>
            {athlete
              ? `Hành trình của ${athlete.name} sẽ sớm có trên ứng dụng.`
              : 'Hồ sơ này có thể đã bị gỡ.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 48 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        testID="athlete-journey-scroll"
      >
        <View style={styles.column}>
          <View>
            <AthleteProfileHero athlete={athlete} profile={profile} />
            {/* Inside the scroll content, so it leaves with the hero. */}
            <View
              pointerEvents="box-none"
              style={[styles.headerOverlay, { paddingTop: insets.top }]}
            >
              <AppHeader
                background="transparent"
                backAccessibilityLabel="Quay lại"
                onBackPress={onBack}
                title=""
              />
            </View>
          </View>

          <View style={styles.body}>
            <AthleteStatsSection profile={profile} />

            <AppButton
              accessibilityLabel={
                journey.following ? 'Đang theo dõi VĐV' : 'Theo dõi VĐV'
              }
              appearance="soft"
              icon={journey.following ? 'bellRinging' : 'bellPhosphor'}
              label={journey.following ? 'Đang theo dõi' : 'Theo dõi VĐV'}
              onPress={journey.toggleFollow}
              variant="secondaryDark"
            />

            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <Text accessibilityRole="header" style={styles.sectionTitle}>
                  Hành trình
                </Text>
                <Text style={styles.sectionRange}>{profile.yearsRange}</Text>
              </View>
              <ScrollView
                contentContainerStyle={styles.chips}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipScroll}
              >
                {journey.filters.map(filter => (
                  <AppChip
                    key={filter}
                    label={filter}
                    onPress={() => journey.selectFilter(filter)}
                    selected={filter === journey.activeFilter}
                    testID={`athlete-filter-${filter}`}
                  />
                ))}
              </ScrollView>
              <AthleteCareerTimeline
                career={journey.career}
                isExpanded={journey.isExpanded}
                onPressVideo={onPressVideo}
                onToggleEvent={journey.toggleEvent}
              />
            </View>

            <AthleteRivalsList rivals={profile.rivals} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: semanticColors.background.canvas, flex: 1 },
  content: { alignItems: 'center', paddingBottom: 48 },
  column: { maxWidth: CONTENT_MAX_WIDTH, width: '100%' },
  body: {
    gap: 22,
    paddingHorizontal: spacing.gutter,
    paddingTop: 18,
  },
  section: { gap: 12 },
  sectionHead: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: { ...dsTypography.title, color: semanticColors.text.primary },
  sectionRange: {
    ...dsTypography.counter,
    color: semanticColors.text.tertiary,
  },
  chipScroll: { flexGrow: 0, marginHorizontal: -spacing.gutter },
  chips: { gap: 8, paddingHorizontal: spacing.gutter, paddingVertical: 2 },
  headerOverlay: { left: 0, position: 'absolute', right: 0, top: 0 },
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
