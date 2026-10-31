import { dsTypography, semanticColors, spacing } from '@jujistu/shared/theme';
import { AppChip, AppHeader, AppInputField, AppToast } from '@jujistu/ui';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AthleteListRow } from '../components/AthleteListRow';
import { AthleteSpotlightCard } from '../components/AthleteSpotlightCard';
import { useAthleteList } from '../hooks/use-athlete-list';

const CONTENT_MAX_WIDTH = 720;

export interface AthleteListScreenProps {
  readonly onSelectAthlete?: (athleteId: string) => void;
  readonly onBack?: () => void;
}

export function AthleteListScreen({
  onSelectAthlete,
  onBack,
}: AthleteListScreenProps) {
  const insets = useSafeAreaInsets();
  const list = useAthleteList();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {onBack ? (
        <AppHeader
          backAccessibilityLabel="Quay lại"
          onBackPress={onBack}
          title="Vận động viên"
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        testID="athlete-list-scroll"
      >
        <View style={styles.column}>
          <View style={styles.gutter}>
            <Text style={styles.overline}>HỒ SƠ & HÀNH TRÌNH</Text>
            <Text accessibilityRole="header" style={styles.title}>
              Vận động viên
            </Text>
          </View>

          <View style={styles.gutter}>
            <AppInputField
              accessibilityLabel="Tìm vận động viên hoặc đoàn"
              autoCapitalize="none"
              leadingIcon="search"
              onChangeText={list.setQuery}
              placeholder="Tìm VĐV, đoàn…"
              size="md"
              value={list.query}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.chips}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
          >
            {list.disciplines.map(discipline => (
              <AppChip
                key={discipline}
                label={discipline}
                onPress={() => list.selectDiscipline(discipline)}
                selected={discipline === list.activeDiscipline}
                testID={`athlete-discipline-${discipline}`}
              />
            ))}
          </ScrollView>

          {list.spotlight ? (
            <View style={styles.gutter}>
              <AthleteSpotlightCard
                athlete={list.spotlight}
                onPress={athlete => list.openAthlete(athlete, onSelectAthlete)}
                teaser={list.spotlightTeaser}
              />
            </View>
          ) : null}

          <View style={styles.gutter}>
            <View style={styles.listHead}>
              <Text style={styles.listTitle}>{list.listTitle}</Text>
              <Text style={styles.listCount}>{list.countLabel}</Text>
            </View>
            {list.athletes.map(athlete => (
              <AthleteListRow
                athlete={athlete}
                key={athlete.id}
                onPress={item => list.openAthlete(item, onSelectAthlete)}
              />
            ))}
            {list.isEmpty ? (
              <View style={styles.empty} testID="athlete-empty">
                <Text style={styles.emptyText}>Không tìm thấy VĐV phù hợp</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {list.notice ? (
        <View pointerEvents="none" style={styles.toast} testID="athlete-notice">
          <AppToast
            message={list.notice}
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
  content: { alignItems: 'center', paddingBottom: 24, paddingTop: 10 },
  column: { gap: 18, maxWidth: CONTENT_MAX_WIDTH, width: '100%' },
  gutter: { paddingHorizontal: spacing.gutter },
  overline: {
    ...dsTypography.overline,
    color: semanticColors.text.accent,
    marginBottom: 6,
  },
  title: { ...dsTypography.display, color: semanticColors.text.primary },
  chipScroll: { flexGrow: 0 },
  chips: { gap: 8, paddingHorizontal: spacing.gutter, paddingVertical: 2 },
  listHead: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  listTitle: { ...dsTypography.overline, color: semanticColors.text.tertiary },
  listCount: { ...dsTypography.counter, color: semanticColors.text.tertiary },
  empty: {
    alignItems: 'center',
    backgroundColor: semanticColors.background.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 36,
  },
  emptyText: { ...dsTypography.body, color: semanticColors.text.secondary },
  toast: {
    bottom: 16,
    left: spacing.gutter,
    position: 'absolute',
    right: spacing.gutter,
  },
});
