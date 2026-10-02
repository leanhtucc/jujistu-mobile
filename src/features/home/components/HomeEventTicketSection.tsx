import { useResponsive } from '@jujistu/shared/constants/responsive';
import { radius, semanticColors, typography } from '@jujistu/shared/theme';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { HOME_EVENT, type HomeEventItem } from '../data/home-content';

const FIGMA_CARD_WIDTH = 359;
const FIGMA_CARD_HEIGHT = 96;

export interface HomeEventTicketSectionProps {
  readonly onPressEvent?: (event: HomeEventItem) => void;
}

export function resolveHomeEventCardWidth(windowWidth: number): number {
  return Math.min(715, Math.max(0, windowWidth - 31));
}

export function HomeEventTicketSection({
  onPressEvent,
}: HomeEventTicketSectionProps) {
  const responsive = useResponsive();
  const cardWidth = resolveHomeEventCardWidth(responsive.width);
  const sectionWidth = Math.min(720, Math.max(0, responsive.width - 26));
  const scale = cardWidth / FIGMA_CARD_WIDTH;

  return (
    <View
      accessibilityLabel="Vé sự kiện"
      style={[styles.container, { width: sectionWidth }]}
    >
      <Text
        accessibilityRole="header"
        style={[
          styles.heading,
          {
            fontSize:
              (typography.heading.md.fontSize as number) * Math.min(1.4, scale),
            lineHeight:
              (typography.heading.md.lineHeight as number) *
              Math.min(1.4, scale),
          },
        ]}
      >
        Vé sự kiện
      </Text>
      <Pressable
        accessibilityLabel={HOME_EVENT.title}
        accessibilityRole="button"
        disabled={!onPressEvent}
        onPress={onPressEvent ? () => onPressEvent(HOME_EVENT) : undefined}
        style={[
          styles.card,
          {
            height: FIGMA_CARD_HEIGHT * scale,
            width: cardWidth,
          },
        ]}
      >
        <View style={styles.surface} />
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={HOME_EVENT.image}
          style={[
            styles.eventImage,
            {
              height: FIGMA_CARD_HEIGHT * scale,
              width: 172 * scale,
            },
          ]}
        />
        <Text
          numberOfLines={4}
          style={[
            styles.title,
            {
              left: 180 * scale,
              top: 10 * scale,
              width: 109 * scale,
              fontSize:
                (typography.heading.xs.fontSize as number) *
                Math.min(1.5, scale),
              lineHeight:
                (typography.heading.xs.lineHeight as number) *
                Math.min(1.5, scale),
            },
          ]}
        >
          {HOME_EVENT.title}
        </Text>
        <Image
          accessible={false}
          importantForAccessibility="no"
          resizeMode="contain"
          source={HOME_EVENT.ticketImage}
          style={[
            styles.ticketImage,
            {
              height: 91 * scale,
              left: 260 * scale,
              top: 2 * scale,
              width: 129 * scale,
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  heading: {
    ...typography.heading.md,
    height: 20,
    marginLeft: 2,
    color: semanticColors.text.primary,
  },
  card: {
    marginTop: 7,
    alignSelf: 'flex-start',
    overflow: 'visible',
  },
  surface: {
    position: 'absolute',
    top: 1,
    right: 0,
    bottom: 0,
    left: 4,
    borderRadius: radius.xs,
    backgroundColor: semanticColors.background.eventSurface,
    opacity: 0.81,
  },
  eventImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: radius.sm,
  },
  title: {
    ...typography.heading.xs,
    position: 'absolute',
    color: semanticColors.text.primary,
  },
  ticketImage: {
    position: 'absolute',
  },
});
