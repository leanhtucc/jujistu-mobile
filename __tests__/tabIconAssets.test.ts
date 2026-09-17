import {
  TAB_ICON_ASSETS,
  type TabIconAssetKey,
} from '@jujistu/app/navigation/tab-icon-assets';

describe('Bottom Navigation Tab Icon Assets Contract', () => {
  const expectedKeys: TabIconAssetKey[] = [
    'home',
    'tournament',
    'shop',
    'mission',
    'friends',
  ];

  it('contains exactly the five verified semantic product destinations', () => {
    const keys = Object.keys(TAB_ICON_ASSETS) as TabIconAssetKey[];
    expect(keys.sort()).toEqual(expectedKeys.sort());
    expect(keys).toHaveLength(5);
  });

  it('defines valid active and inactive SVG icon slots for every destination', () => {
    expectedKeys.forEach(key => {
      const asset = TAB_ICON_ASSETS[key];
      expect(asset).toBeDefined();

      // Active slot — must carry iconName and size
      expect(asset.active).toBeDefined();
      expect(typeof asset.active.iconName).toBe('string');
      expect(asset.active.iconName.length).toBeGreaterThan(0);
      expect(typeof asset.active.size).toBe('number');
      expect(asset.active.size).toBeGreaterThan(0);

      // Inactive slot — must carry iconName and size
      expect(asset.inactive).toBeDefined();
      expect(typeof asset.inactive.iconName).toBe('string');
      expect(asset.inactive.iconName.length).toBeGreaterThan(0);
      expect(typeof asset.inactive.size).toBe('number');
      expect(asset.inactive.size).toBeGreaterThan(0);
    });
  });

  it('enforces verified Figma logical render size for home (27)', () => {
    expect(TAB_ICON_ASSETS.home.active.iconName).toBe('homeActive');
    expect(TAB_ICON_ASSETS.home.active.size).toBe(27);
    expect(TAB_ICON_ASSETS.home.inactive.iconName).toBe('homeInactive');
    expect(TAB_ICON_ASSETS.home.inactive.size).toBe(27);
  });

  it('enforces verified Figma logical render size for shop (20)', () => {
    expect(TAB_ICON_ASSETS.shop.active.iconName).toBe('shopActive');
    expect(TAB_ICON_ASSETS.shop.active.size).toBe(20);
    expect(TAB_ICON_ASSETS.shop.inactive.iconName).toBe('shopInactive');
    expect(TAB_ICON_ASSETS.shop.inactive.size).toBe(20);
  });

  it('enforces verified Figma logical render size for tournament (36)', () => {
    expect(TAB_ICON_ASSETS.tournament.active.iconName).toBe('tournamentActive');
    expect(TAB_ICON_ASSETS.tournament.active.size).toBe(36);
    expect(TAB_ICON_ASSETS.tournament.inactive.iconName).toBe(
      'tournamentInactive',
    );
    expect(TAB_ICON_ASSETS.tournament.inactive.size).toBe(36);
  });

  it('enforces verified Figma logical render size for friends (24)', () => {
    expect(TAB_ICON_ASSETS.friends.active.iconName).toBe('friendsActive');
    expect(TAB_ICON_ASSETS.friends.active.size).toBe(24);
    expect(TAB_ICON_ASSETS.friends.inactive.iconName).toBe('friendsInactive');
    expect(TAB_ICON_ASSETS.friends.inactive.size).toBe(24);
  });

  it('enforces verified Figma logical render size for mission (26)', () => {
    expect(TAB_ICON_ASSETS.mission.active.iconName).toBe('missionActive');
    expect(TAB_ICON_ASSETS.mission.active.size).toBe(26);
    expect(TAB_ICON_ASSETS.mission.inactive.iconName).toBe('missionInactive');
    expect(TAB_ICON_ASSETS.mission.inactive.size).toBe(26);
  });

  it('active and inactive iconNames are distinct for every destination', () => {
    expectedKeys.forEach(key => {
      expect(TAB_ICON_ASSETS[key].active.iconName).not.toBe(
        TAB_ICON_ASSETS[key].inactive.iconName,
      );
    });
  });

  it('MONOCHROME_VECTOR icons (shop, friends) carry color for active/inactive distinction', () => {
    // shop and friends are vector icons — they need explicit color to differentiate states
    expect(TAB_ICON_ASSETS.shop.active.color).toBeDefined();
    expect(TAB_ICON_ASSETS.shop.inactive.color).toBeDefined();
    expect(TAB_ICON_ASSETS.shop.active.color).not.toBe(
      TAB_ICON_ASSETS.shop.inactive.color,
    );

    expect(TAB_ICON_ASSETS.friends.active.color).toBeDefined();
    expect(TAB_ICON_ASSETS.friends.inactive.color).toBeDefined();
    expect(TAB_ICON_ASSETS.friends.active.color).not.toBe(
      TAB_ICON_ASSETS.friends.inactive.color,
    );
  });

  it('FIXED_VISUAL icons (home, tournament, mission) do not carry color — artwork is self-contained', () => {
    // FIXED_VISUAL glyphs embed raster artwork; color prop is meaningless for them
    expect(TAB_ICON_ASSETS.home.active.color).toBeUndefined();
    expect(TAB_ICON_ASSETS.home.inactive.color).toBeUndefined();
    expect(TAB_ICON_ASSETS.tournament.active.color).toBeUndefined();
    expect(TAB_ICON_ASSETS.tournament.inactive.color).toBeUndefined();
    expect(TAB_ICON_ASSETS.mission.active.color).toBeUndefined();
    expect(TAB_ICON_ASSETS.mission.inactive.color).toBeUndefined();
  });
});
