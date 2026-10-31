import { dsTypography, semanticColors, spacing } from '@jujistu/shared/theme';
import { AppChip, AppHeader } from '@jujistu/ui';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TournamentListItem } from '../components/TournamentListItem';
import { useTournamentList } from '../hooks/use-tournament-list';

const CONTENT_MAX_WIDTH = 720;

export interface TournamentListScreenProps {
  readonly onSelectTournament?: (tournamentId: string) => void;
  readonly onBack?: () => void;
}

export function TournamentListScreen({
  onSelectTournament,
  onBack,
}: TournamentListScreenProps) {
  const insets = useSafeAreaInsets();
  const { levels, activeLevel, selectLevel, sections } = useTournamentList();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {onBack ? (
        <AppHeader
          backAccessibilityLabel="Quay lại"
          onBackPress={onBack}
          title="Giải đấu"
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID="tournament-list-scroll"
      >
        <View style={styles.column}>
          <View style={styles.titleBlock}>
            <Text style={styles.overline}>LỊCH GIẢI · MÙA 2026</Text>
            <Text accessibilityRole="header" style={styles.title}>
              Giải đấu
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.chips}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
          >
            {levels.map(level => (
              <AppChip
                key={level}
                label={level}
                onPress={() => selectLevel(level)}
                selected={level === activeLevel}
                testID={`tournament-level-${level}`}
              />
            ))}
          </ScrollView>

          {sections.map(section => (
            <View
              key={section.status}
              style={styles.section}
              testID={`tournament-section-${section.status}`}
            >
              <View style={styles.sectionHead}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color:
                        section.status === 'live'
                          ? semanticColors.text.accent
                          : semanticColors.text.tertiary,
                    },
                  ]}
                >
                  {section.title}
                </Text>
                <Text style={styles.sectionCount}>{section.countLabel}</Text>
              </View>
              {section.items.map(entry => (
                <TournamentListItem
                  entry={entry}
                  key={entry.tournament.id}
                  onPress={onSelectTournament}
                />
              ))}
            </View>
          ))}

          <Text style={styles.footnote}>
            Lịch giải được cập nhật từ hệ thống quản trị nội dung.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: semanticColors.background.canvas, flex: 1 },
  content: { alignItems: 'center', paddingBottom: 24, paddingTop: 10 },
  column: { gap: 18, maxWidth: CONTENT_MAX_WIDTH, width: '100%' },
  titleBlock: { paddingHorizontal: spacing.gutter },
  overline: {
    ...dsTypography.overline,
    color: semanticColors.text.accent,
    marginBottom: 6,
  },
  title: { ...dsTypography.display, color: semanticColors.text.primary },
  chipScroll: { flexGrow: 0 },
  chips: { gap: 8, paddingHorizontal: spacing.gutter, paddingVertical: 2 },
  section: { gap: 10, paddingHorizontal: spacing.gutter },
  sectionHead: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: dsTypography.overline,
  sectionCount: {
    ...dsTypography.counter,
    color: semanticColors.text.tertiary,
  },
  footnote: {
    ...dsTypography.body,
    color: semanticColors.text.tertiary,
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: spacing.gutter,
  },
});
