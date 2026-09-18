import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HomeHeroCarousel } from '../components/HomeHeroCarousel';
import { HomeNewsSection } from '../components/HomeNewsSection';
import { HomeQuickActions } from '../components/HomeQuickActions';

export function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <HomeHeroCarousel />
      <View style={styles.newsSection}>
        <HomeNewsSection />
      </View>
      <View style={styles.quickActions}>
        <HomeQuickActions />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    minHeight: 653,
    paddingTop: 12,
    paddingBottom: 15,
  },
  newsSection: {
    marginTop: 8,
  },
  quickActions: {
    marginTop: 92,
  },
});
