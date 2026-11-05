import { ChevronLeftGlyph } from './glyphs/ChevronLeftGlyph';
import { LogOutGlyph } from './glyphs/LogOutGlyph';
import { MailGlyph } from './glyphs/MailGlyph';
import { AddGlyph } from './glyphs/common/ic_add';
import { ArrowRightGlyph } from './glyphs/common/ic_arrow_right';
import { BellGlyph } from './glyphs/common/ic_bell';
import { CoinGlyph } from './glyphs/common/ic_coin';
import { GemGlyph } from './glyphs/common/ic_gem';
import { SettingsGlyph } from './glyphs/common/ic_settings';
import { ClubGlyph } from './glyphs/home/ic_club';
import { GiftGlyph } from './glyphs/home/ic_gift';
import { LeaderboardGlyph } from './glyphs/home/ic_leaderboard';
import { LiveGlyph } from './glyphs/home/ic_live';
import { MinigameGlyph } from './glyphs/home/ic_minigame';
import { MmaAcademyGlyph } from './glyphs/home/ic_mma_academy';
import { HomeActiveGlyph } from './glyphs/tabs/home-active';
import { HomeInactiveGlyph } from './glyphs/tabs/home-inactive';
import { ShopActiveGlyph } from './glyphs/tabs/shop-active';
import { ShopInactiveGlyph } from './glyphs/tabs/shop-inactive';
import { TournamentActiveGlyph } from './glyphs/tabs/tournament-active';
import { TournamentInactiveGlyph } from './glyphs/tabs/tournament-inactive';
import { MissionActiveGlyph } from './glyphs/tabs/mission-active';
import { MissionInactiveGlyph } from './glyphs/tabs/mission-inactive';
import { FriendsActiveGlyph } from './glyphs/tabs/friends-active';
import { FriendsInactiveGlyph } from './glyphs/tabs/friends-inactive';
import { AthletesActiveGlyph } from './glyphs/tabs/athletes-active';
import { AthletesInactiveGlyph } from './glyphs/tabs/athletes-inactive';
import { FullscreenBlGlyph } from './glyphs/video/ic_fullscreen_bl';
import { FullscreenBrGlyph } from './glyphs/video/ic_fullscreen_br';
import { FullscreenTlGlyph } from './glyphs/video/ic_fullscreen_tl';
import { FullscreenTrGlyph } from './glyphs/video/ic_fullscreen_tr';
import { PlayGlyph } from './glyphs/video/ic_play';
import { SearchGlyph } from './glyphs/video/ic_search';
import { VolumeUpGlyph } from './glyphs/video/ic_volume_up';
import { HouseGlyph } from './glyphs/phosphor/ic_house';
import { HouseFillGlyph } from './glyphs/phosphor/ic_house_fill';
import { StorefrontGlyph } from './glyphs/phosphor/ic_storefront';
import { StorefrontFillGlyph } from './glyphs/phosphor/ic_storefront_fill';
import { TrophyGlyph } from './glyphs/phosphor/ic_trophy';
import { TrophyFillGlyph } from './glyphs/phosphor/ic_trophy_fill';
import { PathGlyph } from './glyphs/phosphor/ic_path';
import { PathFillGlyph } from './glyphs/phosphor/ic_path_fill';
import { TargetGlyph } from './glyphs/phosphor/ic_target';
import { TargetFillGlyph } from './glyphs/phosphor/ic_target_fill';
import { CalendarCheckGlyph } from './glyphs/phosphor/ic_calendar_check';
import { MedalGlyph } from './glyphs/phosphor/ic_medal';
import { TicketGlyph } from './glyphs/phosphor/ic_ticket';
import { YoutubeLogoGlyph } from './glyphs/phosphor/ic_youtube_logo';
import { UsersThreeGlyph } from './glyphs/phosphor/ic_users_three';
import { RankingGlyph } from './glyphs/phosphor/ic_ranking';
import { GameControllerGlyph } from './glyphs/phosphor/ic_game_controller';
import { BellPhosphorGlyph } from './glyphs/phosphor/ic_bell_phosphor';
import { BellRingingGlyph } from './glyphs/phosphor/ic_bell_ringing';
import { BellSlashGlyph } from './glyphs/phosphor/ic_bell_slash';
import { CoinsPhosphorGlyph } from './glyphs/phosphor/ic_coins_phosphor';
import { PlayCirclePhosphorGlyph } from './glyphs/phosphor/ic_play_circle_phosphor';
import { ClockGlyph } from './glyphs/phosphor/ic_clock';
import { PlusGlyph } from './glyphs/common/ic_plus';
import { MinusGlyph } from './glyphs/common/ic_minus';
import { CheckGlyph } from './glyphs/common/ic_check';
import { ShoppingBagGlyph } from './glyphs/common/ic_shopping_bag';
import { GiftMonoGlyph } from './glyphs/common/ic_gift_mono';
import { MapPinGlyph } from './glyphs/common/ic_map_pin';

/**
 * Immutable production registry of verified glyph components.
 */
export const glyphs = {
  // ── Shared UI glyphs ──────────────────────────────────────────────
  chevronLeft: ChevronLeftGlyph,
  logOut: LogOutGlyph,
  mail: MailGlyph,
  settings: SettingsGlyph,
  gem: GemGlyph,
  coin: CoinGlyph,
  bell: BellGlyph,
  arrowRight: ArrowRightGlyph,
  balanceAdd: AddGlyph,
  // ── Phosphor vector glyphs (Jujitsu Design System) ─────────────────
  house: HouseGlyph,
  houseFill: HouseFillGlyph,
  storefront: StorefrontGlyph,
  storefrontFill: StorefrontFillGlyph,
  trophy: TrophyGlyph,
  trophyFill: TrophyFillGlyph,
  path: PathGlyph,
  pathFill: PathFillGlyph,
  target: TargetGlyph,
  targetFill: TargetFillGlyph,
  calendarCheck: CalendarCheckGlyph,
  medal: MedalGlyph,
  ticket: TicketGlyph,
  youtubeLogo: YoutubeLogoGlyph,
  usersThree: UsersThreeGlyph,
  ranking: RankingGlyph,
  gameController: GameControllerGlyph,
  bellPhosphor: BellPhosphorGlyph,
  bellRinging: BellRingingGlyph,
  bellSlash: BellSlashGlyph,
  coinsPhosphor: CoinsPhosphorGlyph,
  playCirclePhosphor: PlayCirclePhosphorGlyph,
  clock: ClockGlyph,
  plus: PlusGlyph,
  minus: MinusGlyph,
  check: CheckGlyph,
  shoppingBag: ShoppingBagGlyph,
  giftMono: GiftMonoGlyph,
  mapPin: MapPinGlyph,
  // ── Home quick-action glyphs ──────────────────────────────────────
  club: ClubGlyph,
  gift: GiftGlyph,
  leaderboard: LeaderboardGlyph,
  live: LiveGlyph,
  minigame: MinigameGlyph,
  mmaAcademy: MmaAcademyGlyph,
  // ── Bottom Navigation tab icons ───────────────────────────────────
  homeActive: HomeActiveGlyph,
  homeInactive: HomeInactiveGlyph,
  shopActive: ShopActiveGlyph,
  shopInactive: ShopInactiveGlyph,
  tournamentActive: TournamentActiveGlyph,
  tournamentInactive: TournamentInactiveGlyph,
  missionActive: MissionActiveGlyph,
  missionInactive: MissionInactiveGlyph,
  friendsActive: FriendsActiveGlyph,
  friendsInactive: FriendsInactiveGlyph,
  athletesActive: AthletesActiveGlyph,
  athletesInactive: AthletesInactiveGlyph,
  // ── Video browsing and playback glyphs ───────────────────────────
  search: SearchGlyph,
  play: PlayGlyph,
  volumeUp: VolumeUpGlyph,
  fullscreenTopLeft: FullscreenTlGlyph,
  fullscreenTopRight: FullscreenTrGlyph,
  fullscreenBottomRight: FullscreenBrGlyph,
  fullscreenBottomLeft: FullscreenBlGlyph,
} as const;
