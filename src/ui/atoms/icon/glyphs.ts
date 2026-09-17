import { ChevronLeftGlyph } from './glyphs/ChevronLeftGlyph';
import { LogOutGlyph } from './glyphs/LogOutGlyph';
import { AddGlyph } from './glyphs/common/ic_add';
import { CoinGlyph } from './glyphs/common/ic_coin';
import { GemGlyph } from './glyphs/common/ic_gem';
import { SettingsGlyph } from './glyphs/common/ic_settings';
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

/**
 * Immutable production registry of verified Figma glyph components.
 * Populated strictly and exclusively with VERIFIED_IMPLEMENTED glyphs.
 * Must contain zero placeholder, visual-approximation, or blocked candidate glyphs.
 *
 * Current State: 16 VERIFIED_IMPLEMENTED glyphs.
 *   Shared UI:  chevronLeft, logOut, settings, gem, coin, balanceAdd (6)
 *   Tab icons:  homeActive, homeInactive, shopActive, shopInactive,
 *               tournamentActive, tournamentInactive, missionActive,
 *               missionInactive, friendsActive, friendsInactive (10)
 */
export const glyphs = {
  // ── Shared UI glyphs ──────────────────────────────────────────────
  chevronLeft: ChevronLeftGlyph,
  logOut: LogOutGlyph,
  settings: SettingsGlyph,
  gem: GemGlyph,
  coin: CoinGlyph,
  balanceAdd: AddGlyph,
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
} as const;
