import type { UserProfile } from '@jujistu/features/auth';
import { HomeScreen } from '@jujistu/features/home';
import {
  VideoLibraryScreen,
  VideoPlayerScreen,
} from '@jujistu/features/videos';
import { ShopScreen } from '@jujistu/features/shop';
import {
  TournamentListScreen,
  TournamentDetailScreen,
} from '@jujistu/features/tournaments';
import {
  AthleteListScreen,
  AthleteJourneyScreen,
} from '@jujistu/features/athletes';
import { MissionScreen } from '@jujistu/features/missions';
import {
  NotificationCenter,
  useNotifications,
  type NotificationTarget,
} from '@jujistu/features/notifications';
import {
  TicketPurchaseScreen,
  MyTicketsScreen,
} from '@jujistu/features/tickets';
import { primitiveColors } from '@jujistu/shared/theme';
import { AppBottomNavigation } from '@jujistu/ui';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BOTTOM_NAVIGATION_ITEMS,
  type BottomNavigationProductKey,
} from './bottom-navigation-items';
import { AUTH_ROUTES, MAIN_ROUTES, ROOT_ROUTES } from './routes';
import type { MainStackParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

/** Wallet balance at app start, until the wallet comes from the API. */
const INITIAL_COIN_BALANCE = 12_500;

export interface MainNavigatorProps {
  readonly onLogin?: () => void;
  readonly onReady?: () => void;
  readonly user?: UserProfile | null;
}

interface MainNavigationContentProps extends MainNavigatorProps {
  readonly coins: number;
  readonly onEarn: (amount: number) => void;
}

function MainNavigationContent({
  coins,
  onEarn,
  onLogin,
  onReady,
  user,
}: MainNavigationContentProps) {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mainNavigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [activeTab, setActiveTab] =
    useState<BottomNavigationProductKey>('home');
  const notifications = useNotifications();
  // A tab stays mounted once visited and is only hidden, so its state (mission
  // progress, cart, scroll position, filters) survives switching tabs.
  const [visited, setVisited] = useState<
    ReadonlySet<BottomNavigationProductKey>
  >(() => new Set(['home']));

  useEffect(() => {
    setVisited(current =>
      current.has(activeTab) ? current : new Set(current).add(activeTab),
    );
  }, [activeTab]);

  const renderPane = (key: BottomNavigationProductKey, node: React.ReactNode) =>
    visited.has(key) || activeTab === key ? (
      <View
        key={key}
        style={[styles.pane, activeTab === key ? null : styles.paneHidden]}
      >
        {node}
      </View>
    ) : null;

  const handleNotificationTarget = useCallback(
    (target: NotificationTarget) => {
      if (target.type === 'tournament') {
        mainNavigation.navigate(MAIN_ROUTES.TOURNAMENT_DETAIL, {
          tournamentId: target.tournamentId,
          initialTab: target.tab,
        });
      } else {
        setActiveTab(target.type === 'missions' ? 'mission' : 'shop');
      }
    },
    [mainNavigation],
  );

  const handleLogin = useCallback(() => {
    if (onLogin) {
      onLogin();
    } else {
      navigation.navigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.LOGIN });
    }
  }, [navigation, onLogin]);

  const handleBottomNavigationPress = useCallback(
    (key: BottomNavigationProductKey) => {
      setActiveTab(key);
    },
    [],
  );

  return (
    <View style={styles.root}>
      <View style={styles.screenContainer}>
        {renderPane(
          'home',
          <HomeScreen
            coinBalance={coins}
            hasUnreadNotifications={notifications.hasUnread}
            onLogin={handleLogin}
            onPressNews={item => {
              if (item.id === 'news-ath-da') {
                mainNavigation.navigate(MAIN_ROUTES.ATHLETE_JOURNEY, {
                  athleteId: 'Trần Đức Anh',
                });
              } else {
                mainNavigation.navigate(MAIN_ROUTES.TOURNAMENT_DETAIL, {
                  tournamentId: item.id === 'news-hn26' ? 'hn' : 'nat26',
                  initialTab: item.id === 'news-hn26' ? undefined : 'Tổng sắp',
                });
              }
            }}
            onPressNotifications={notifications.open}
            onPressProduct={() => setActiveTab('shop')}
            onPressResults={() =>
              mainNavigation.navigate(MAIN_ROUTES.TOURNAMENT_DETAIL, {
                tournamentId: 'nat26',
                initialTab: 'Kết quả',
              })
            }
            onPressTournament={() =>
              mainNavigation.navigate(MAIN_ROUTES.TOURNAMENT_DETAIL, {
                tournamentId: 'hn',
              })
            }
            onPressAllVideos={() => mainNavigation.navigate(MAIN_ROUTES.VIDEOS)}
            onPressAthlete={() =>
              mainNavigation.navigate(MAIN_ROUTES.ATHLETE_JOURNEY, {
                athleteId: 'Trần Đức Anh',
              })
            }
            onPressCoins={() => setActiveTab('mission')}
            onPressHeroSlide={slide => {
              if (slide.actionType === 'shop') setActiveTab('shop');
              else if (slide.actionType === 'athlete')
                mainNavigation.navigate(MAIN_ROUTES.ATHLETE_JOURNEY, {
                  athleteId: 'Trần Đức Anh',
                });
              else if (slide.actionType === 'youtube')
                mainNavigation.navigate(MAIN_ROUTES.VIDEOS);
            }}
            onPressLive={() => mainNavigation.navigate(MAIN_ROUTES.VIDEOS)}
            onPressSchedule={() =>
              mainNavigation.navigate(MAIN_ROUTES.TOURNAMENT_DETAIL, {
                tournamentId: 'nat26',
                initialTab: 'Lịch thi đấu',
              })
            }
            onPressShop={() => setActiveTab('shop')}
            onPressShortcut={shortcut => {
              if (shortcut.key === 'tournaments') setActiveTab('tournament');
              else if (shortcut.key === 'results')
                mainNavigation.navigate(MAIN_ROUTES.TOURNAMENT_DETAIL, {
                  tournamentId: 'nat26',
                  initialTab: 'Kết quả',
                });
              else if (shortcut.key === 'tickets')
                mainNavigation.navigate(MAIN_ROUTES.TICKETS, {
                  tournamentId: 'nat26',
                });
              else if (shortcut.key === 'videos')
                mainNavigation.navigate(MAIN_ROUTES.VIDEOS);
            }}
            onPressTickets={() =>
              mainNavigation.navigate(MAIN_ROUTES.TICKETS, {
                tournamentId: 'nat26',
              })
            }
            onPressVideo={video =>
              mainNavigation.navigate(MAIN_ROUTES.VIDEO_PLAYER, {
                videoId: video.id,
              })
            }
            onReady={onReady}
            user={user}
          />,
        )}
        {renderPane(
          'shop',
          <ShopScreen
            onOpenTicket={zone =>
              mainNavigation.navigate(MAIN_ROUTES.TICKETS, {
                tournamentId: 'nat26',
                zone,
              })
            }
          />,
        )}
        {renderPane(
          'tournament',
          <TournamentListScreen
            onSelectTournament={tournamentId =>
              mainNavigation.navigate(MAIN_ROUTES.TOURNAMENT_DETAIL, {
                tournamentId,
              })
            }
          />,
        )}
        {renderPane(
          'athletes',
          <AthleteListScreen
            onSelectAthlete={athleteId =>
              mainNavigation.navigate(MAIN_ROUTES.ATHLETE_JOURNEY, {
                athleteId,
              })
            }
          />,
        )}
        {renderPane('mission', <MissionScreen coins={coins} onEarn={onEarn} />)}
      </View>
      <AppBottomNavigation
        activeKey={activeTab}
        items={BOTTOM_NAVIGATION_ITEMS}
        onItemPress={handleBottomNavigationPress}
      />
      <View style={[styles.bottomInset, { height: insets.bottom }]} />
      <NotificationCenter
        items={notifications.items}
        onClose={notifications.close}
        onSelect={item => notifications.select(item, handleNotificationTarget)}
        visible={notifications.isOpen}
      />
    </View>
  );
}

export function MainNavigator({ onLogin, onReady, user }: MainNavigatorProps) {
  const [coins, setCoins] = useState(INITIAL_COIN_BALANCE);
  const handleEarn = useCallback(
    (amount: number) => setCoins(value => value + amount),
    [],
  );

  return (
    <Stack.Navigator
      initialRouteName={MAIN_ROUTES.HOME}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={MAIN_ROUTES.HOME}>
        {() => (
          <MainNavigationContent
            coins={coins}
            onEarn={handleEarn}
            onLogin={onLogin}
            onReady={onReady}
            user={user}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={MAIN_ROUTES.SHOP}>
        {({ navigation }) => (
          <ShopScreen
            onBack={() => navigation.goBack()}
            onOpenTicket={zone =>
              navigation.navigate(MAIN_ROUTES.TICKETS, {
                tournamentId: 'nat26',
                zone,
              })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={MAIN_ROUTES.TOURNAMENTS}>
        {({ navigation }) => (
          <TournamentListScreen
            onBack={() => navigation.goBack()}
            onSelectTournament={tournamentId =>
              navigation.navigate(MAIN_ROUTES.TOURNAMENT_DETAIL, {
                tournamentId,
              })
            }
          />
        )}
      </Stack.Screen>
      {/* A distinct id per tournament and tab: navigating with new params must
          open a fresh screen, because the detail keeps its tab in state. */}
      <Stack.Screen
        getId={({ params }) =>
          `${params.tournamentId}:${params.initialTab ?? ''}`
        }
        name={MAIN_ROUTES.TOURNAMENT_DETAIL}
      >
        {({ navigation, route }) => (
          <TournamentDetailScreen
            initialTab={route.params.initialTab}
            onBack={() => navigation.goBack()}
            onPressAthlete={athleteId =>
              navigation.navigate(MAIN_ROUTES.ATHLETE_JOURNEY, { athleteId })
            }
            onPressWatch={() => navigation.navigate(MAIN_ROUTES.VIDEOS)}
            tournamentId={route.params.tournamentId}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={MAIN_ROUTES.ATHLETES}>
        {({ navigation }) => (
          <AthleteListScreen
            onBack={() => navigation.goBack()}
            onSelectAthlete={athleteId =>
              navigation.navigate(MAIN_ROUTES.ATHLETE_JOURNEY, { athleteId })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        getId={({ params }) => params?.athleteId}
        name={MAIN_ROUTES.ATHLETE_JOURNEY}
      >
        {({ navigation, route }) => (
          <AthleteJourneyScreen
            athleteId={route.params?.athleteId}
            onBack={() => navigation.goBack()}
            onPressVideo={() => navigation.navigate(MAIN_ROUTES.VIDEOS)}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={MAIN_ROUTES.MISSIONS}>
        {({ navigation }) => (
          <MissionScreen
            coins={coins}
            onBack={() => navigation.goBack()}
            onEarn={handleEarn}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={MAIN_ROUTES.TICKETS}>
        {({ navigation, route }) => (
          <TicketPurchaseScreen
            initialZone={route.params?.zone}
            onBack={() => navigation.goBack()}
            onGoHome={() => navigation.navigate(MAIN_ROUTES.HOME)}
            onOpenMyTickets={() => navigation.navigate(MAIN_ROUTES.MY_TICKETS)}
            tournamentId={route.params?.tournamentId}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={MAIN_ROUTES.MY_TICKETS}>
        {({ navigation }) => (
          <MyTicketsScreen
            onBack={() => navigation.goBack()}
            onBuyTicket={() =>
              navigation.navigate(MAIN_ROUTES.TICKETS, {
                tournamentId: 'nat26',
              })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={MAIN_ROUTES.VIDEOS}>
        {({ navigation }) => (
          <VideoLibraryScreen
            onBack={() => navigation.goBack()}
            onSelectVideo={videoId =>
              navigation.navigate(MAIN_ROUTES.VIDEO_PLAYER, { videoId })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={MAIN_ROUTES.VIDEO_PLAYER}>
        {({ navigation, route }) => (
          <VideoPlayerScreen
            onBack={() => navigation.goBack()}
            videoId={route.params.videoId}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: primitiveColors.neutral[1000],
  },
  screenContainer: {
    flex: 1,
  },
  pane: {
    flex: 1,
  },
  paneHidden: {
    display: 'none',
  },
  bottomInset: {
    backgroundColor: primitiveColors.neutral[1000],
  },
});
