import {
  TAB_ICON_ASSETS,
  type TabIconAssetKey,
} from '@jujistu/app/navigation/tab-icon-assets';

describe('Bottom Navigation Tab Icon Assets Contract', () => {
  const expectedKeys: TabIconAssetKey[] = [
    'home',
    'tournament',
    'shop',
    'athletes',
    'mission',
    'friends',
  ];

  it('contains the verified semantic product destinations', () => {
    const keys = Object.keys(TAB_ICON_ASSETS) as TabIconAssetKey[];
    expect(keys.sort()).toEqual(expectedKeys.sort());
    expect(keys).toHaveLength(6);
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

  it('enforces verified logical render size for home (24)', () => {
    expect(TAB_ICON_ASSETS.home.active.iconName).toBe('houseFill');
    expect(TAB_ICON_ASSETS.home.active.size).toBe(24);
    expect(TAB_ICON_ASSETS.home.inactive.iconName).toBe('house');
    expect(TAB_ICON_ASSETS.home.inactive.size).toBe(24);
  });

  it('enforces verified logical render size for shop (24)', () => {
    expect(TAB_ICON_ASSETS.shop.active.iconName).toBe('storefrontFill');
    expect(TAB_ICON_ASSETS.shop.active.size).toBe(24);
    expect(TAB_ICON_ASSETS.shop.inactive.iconName).toBe('storefront');
    expect(TAB_ICON_ASSETS.shop.inactive.size).toBe(24);
  });

  it('enforces verified logical render size for tournament (24)', () => {
    expect(TAB_ICON_ASSETS.tournament.active.iconName).toBe('trophyFill');
    expect(TAB_ICON_ASSETS.tournament.active.size).toBe(24);
    expect(TAB_ICON_ASSETS.tournament.inactive.iconName).toBe('trophy');
    expect(TAB_ICON_ASSETS.tournament.inactive.size).toBe(24);
  });

  it('enforces verified logical render size for athletes (24)', () => {
    expect(TAB_ICON_ASSETS.athletes.active.iconName).toBe('pathFill');
    expect(TAB_ICON_ASSETS.athletes.active.size).toBe(24);
    expect(TAB_ICON_ASSETS.athletes.inactive.iconName).toBe('path');
    expect(TAB_ICON_ASSETS.athletes.inactive.size).toBe(24);
  });

  it('enforces verified logical render size for friends (24)', () => {
    expect(TAB_ICON_ASSETS.friends.active.iconName).toBe('usersThree');
    expect(TAB_ICON_ASSETS.friends.active.size).toBe(24);
    expect(TAB_ICON_ASSETS.friends.inactive.iconName).toBe('usersThree');
    expect(TAB_ICON_ASSETS.friends.inactive.size).toBe(24);
  });

  it('enforces verified logical render size for mission (24)', () => {
    expect(TAB_ICON_ASSETS.mission.active.iconName).toBe('targetFill');
    expect(TAB_ICON_ASSETS.mission.active.size).toBe(24);
    expect(TAB_ICON_ASSETS.mission.inactive.iconName).toBe('target');
    expect(TAB_ICON_ASSETS.mission.inactive.size).toBe(24);
  });

  it('active and inactive iconNames are distinct for main bottom navigation destinations', () => {
    const mainKeys: TabIconAssetKey[] = [
      'home',
      'tournament',
      'shop',
      'athletes',
      'mission',
    ];
    mainKeys.forEach(key => {
      expect(TAB_ICON_ASSETS[key].active.iconName).not.toBe(
        TAB_ICON_ASSETS[key].inactive.iconName,
      );
    });
  });

  it('Phosphor vector icons carry white for active and grey for inactive', () => {
    expectedKeys.forEach(key => {
      expect(TAB_ICON_ASSETS[key].active.color).toBe('#FFFFFF');
      expect(TAB_ICON_ASSETS[key].inactive.color).toBe('#7D7F84');
      expect(TAB_ICON_ASSETS[key].active.color).not.toBe(
        TAB_ICON_ASSETS[key].inactive.color,
      );
    });
  });
});
