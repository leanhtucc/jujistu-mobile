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

  it('defines valid active and inactive image assets for every destination', () => {
    expectedKeys.forEach(key => {
      const asset = TAB_ICON_ASSETS[key];
      expect(asset).toBeDefined();

      // Active state checks
      expect(asset.active).toBeDefined();
      expect(asset.active.source).toBeDefined();
      expect(typeof asset.active.width).toBe('number');
      expect(typeof asset.active.height).toBe('number');
      expect(asset.active.width).toBeGreaterThan(0);
      expect(asset.active.height).toBeGreaterThan(0);

      // Inactive state checks
      expect(asset.inactive).toBeDefined();
      expect(asset.inactive.source).toBeDefined();
      expect(typeof asset.inactive.width).toBe('number');
      expect(typeof asset.inactive.height).toBe('number');
      expect(asset.inactive.width).toBeGreaterThan(0);
      expect(asset.inactive.height).toBeGreaterThan(0);
    });
  });

  it('enforces verified Figma logical render dimensions for home (27x23)', () => {
    expect(TAB_ICON_ASSETS.home.active.width).toBe(27);
    expect(TAB_ICON_ASSETS.home.active.height).toBe(23);
    expect(TAB_ICON_ASSETS.home.inactive.width).toBe(27);
    expect(TAB_ICON_ASSETS.home.inactive.height).toBe(23);
  });

  it('enforces verified Figma logical render dimensions for shop (20x20)', () => {
    expect(TAB_ICON_ASSETS.shop.active.width).toBe(20);
    expect(TAB_ICON_ASSETS.shop.active.height).toBe(20);
    expect(TAB_ICON_ASSETS.shop.inactive.width).toBe(20);
    expect(TAB_ICON_ASSETS.shop.inactive.height).toBe(20);
  });

  it('enforces verified Figma logical render dimensions for tournament (36x20)', () => {
    expect(TAB_ICON_ASSETS.tournament.active.width).toBe(36);
    expect(TAB_ICON_ASSETS.tournament.active.height).toBe(20);
    expect(TAB_ICON_ASSETS.tournament.inactive.width).toBe(36);
    expect(TAB_ICON_ASSETS.tournament.inactive.height).toBe(20);
  });

  it('enforces verified Figma logical render dimensions for friends (24x22)', () => {
    expect(TAB_ICON_ASSETS.friends.active.width).toBe(24);
    expect(TAB_ICON_ASSETS.friends.active.height).toBe(22);
    expect(TAB_ICON_ASSETS.friends.inactive.width).toBe(24);
    expect(TAB_ICON_ASSETS.friends.inactive.height).toBe(22);
  });

  it('preserves the distinct active vs inactive height for mission (active 26x26 vs inactive 26x24)', () => {
    expect(TAB_ICON_ASSETS.mission.active.width).toBe(26);
    expect(TAB_ICON_ASSETS.mission.active.height).toBe(26);

    expect(TAB_ICON_ASSETS.mission.inactive.width).toBe(26);
    expect(TAB_ICON_ASSETS.mission.inactive.height).toBe(24);

    expect(TAB_ICON_ASSETS.mission.active.height).not.toBe(
      TAB_ICON_ASSETS.mission.inactive.height,
    );
  });
});
