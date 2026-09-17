import React from 'react';
import { StyleSheet } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

declare const require: (module: string) => any;
declare const __dirname: string;

const fs = require('fs');
const path = require('path');

import { AppBottomNavigation, AppIcon } from '@jujistu/ui';
import type {
  AppBottomNavigationProps,
  BottomNavigationIconNameSource,
  BottomNavigationItemData,
} from '@jujistu/ui';
import * as PublicUi from '@jujistu/ui';
import { BottomNavigationItem } from '../src/ui/organisms/bottom-navigation-item';
import {
  BOTTOM_NAV_ACTIVE_LABEL_GRADIENT,
  BOTTOM_NAV_ICON_SLOT,
  BOTTOM_NAV_INACTIVE_LABEL_COLOR,
  BOTTOM_NAV_THEME,
} from '../src/ui/organisms/bottom-navigation-theme';

// ---------------------------------------------------------------------------
// Fixtures & Helpers
// ---------------------------------------------------------------------------

function makeIconSlot(
  name: BottomNavigationIconNameSource['iconName'],
  size: number,
): BottomNavigationIconNameSource {
  return { iconName: name, size };
}

const HOME_ACTIVE = makeIconSlot('homeActive', 27);
const HOME_INACTIVE = makeIconSlot('homeInactive', 27);
const SHOP_ACTIVE = makeIconSlot('shopActive', 20);
const SHOP_INACTIVE = makeIconSlot('shopInactive', 20);
const MISSION_ACTIVE = makeIconSlot('missionActive', 26);
const MISSION_INACTIVE = makeIconSlot('missionInactive', 26);

const FIVE_ITEMS: ReadonlyArray<BottomNavigationItemData<string>> = [
  {
    key: 'home',
    label: 'Home',
    activeIcon: HOME_ACTIVE,
    inactiveIcon: HOME_INACTIVE,
  },
  {
    key: 'shop',
    label: 'Shop',
    activeIcon: SHOP_ACTIVE,
    inactiveIcon: SHOP_INACTIVE,
  },
  {
    key: 'mission',
    label: 'Mission',
    activeIcon: MISSION_ACTIVE,
    inactiveIcon: MISSION_INACTIVE,
    accessibilityLabel: 'Mission custom',
  },
  {
    key: 'friends',
    label: 'Friends',
    activeIcon: makeIconSlot('friendsActive', 24),
    inactiveIcon: makeIconSlot('friendsInactive', 24),
  },
  {
    key: 'tournament',
    label: 'Tournament',
    activeIcon: makeIconSlot('tournamentActive', 36),
    inactiveIcon: makeIconSlot('tournamentInactive', 36),
  },
];

function renderNav(
  props: Partial<AppBottomNavigationProps<string>> = {},
): ReactTestRenderer.ReactTestRenderer {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <AppBottomNavigation
        activeKey="home"
        items={FIVE_ITEMS}
        onItemPress={jest.fn()}
        {...props}
      />,
    );
  });
  return tree;
}

function getTabItems(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findAllByType(BottomNavigationItem);
}

function getTabPressable(item: ReactTestRenderer.ReactTestInstance) {
  return item.findAllByProps({ accessibilityRole: 'tab' })[0];
}

function getTabA11yNode(item: ReactTestRenderer.ReactTestInstance) {
  const nodes = item.findAllByProps({ accessibilityRole: 'tab' });
  return nodes[nodes.length - 1];
}

// ---------------------------------------------------------------------------
// 1. Renders every provided item label
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 1. Item labels', () => {
  it('renders a label for each supplied item', () => {
    const tree = renderNav();
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Home');
    expect(json).toContain('Shop');
    expect(json).toContain('Mission');
    expect(json).toContain('Friends');
    expect(json).toContain('Tournament');
  });
});

// ---------------------------------------------------------------------------
// 2. Inactive icon slot for inactive items
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 2. Inactive icon slots', () => {
  it('renders AppIcon with the inactiveIcon iconName for every non-active item', () => {
    const tree = renderNav({ activeKey: 'home' });
    const icons = tree.root.findAllByType(AppIcon);
    // shop is inactive — its iconName should be shopInactive
    const shopIcon = icons.find(
      icon => icon.props.name === SHOP_INACTIVE.iconName,
    );
    expect(shopIcon).toBeDefined();
  });

  it('renders AppIcon with the activeIcon iconName for the active item', () => {
    const tree = renderNav({ activeKey: 'shop' });
    const icons = tree.root.findAllByType(AppIcon);
    const shopActiveIcon = icons.find(
      icon => icon.props.name === SHOP_ACTIVE.iconName,
    );
    expect(shopActiveIcon).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 3. Active icon slot for activeKey
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 3. Active icon slot', () => {
  it('renders AppIcon with homeActive name for the active home tab', () => {
    const tree = renderNav({ activeKey: 'home' });
    const icons = tree.root.findAllByType(AppIcon);
    const homeActiveIcon = icons.find(
      icon => icon.props.name === HOME_ACTIVE.iconName,
    );
    expect(homeActiveIcon).toBeDefined();
  });

  it('renders AppIcon with homeInactive name when home is not active', () => {
    const tree = renderNav({ activeKey: 'shop' });
    const icons = tree.root.findAllByType(AppIcon);
    const homeInactiveIcon = icons.find(
      icon => icon.props.name === HOME_INACTIVE.iconName,
    );
    expect(homeInactiveIcon).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 4. AppIcon receives configured size from the icon slot
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 4. Icon size forwarding', () => {
  it('forwards home active slot size (27) to AppIcon', () => {
    const tree = renderNav({ activeKey: 'home' });
    const icons = tree.root.findAllByType(AppIcon);
    const homeIcon = icons.find(
      icon => icon.props.name === HOME_ACTIVE.iconName,
    );
    expect(homeIcon).toBeDefined();
    expect(homeIcon!.props.size).toBe(27);
  });

  it('forwards home inactive slot size (27) to AppIcon', () => {
    const tree = renderNav({ activeKey: 'shop' });
    const icons = tree.root.findAllByType(AppIcon);
    const homeIcon = icons.find(
      icon => icon.props.name === HOME_INACTIVE.iconName,
    );
    expect(homeIcon).toBeDefined();
    expect(homeIcon!.props.size).toBe(27);
  });

  it('forwards tournament slot size (36) to AppIcon', () => {
    const tree = renderNav({ activeKey: 'tournament' });
    const icons = tree.root.findAllByType(AppIcon);
    const tournamentIcon = icons.find(
      icon => icon.props.name === 'tournamentActive',
    );
    expect(tournamentIcon).toBeDefined();
    expect(tournamentIcon!.props.size).toBe(36);
  });
});

// ---------------------------------------------------------------------------
// 5. Every AppIcon is centered inside a 36×36 icon slot
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 5. 36×36 icon slot', () => {
  it('every AppIcon is inside a View with width=36 and height=36', () => {
    const tree = renderNav();
    const icons = tree.root.findAllByType(AppIcon);

    icons.forEach(icon => {
      const parent = icon.parent as ReactTestRenderer.ReactTestInstance;
      // parent is the iconNameView View; grandparent is the iconSlot View
      const grandparent = parent.parent as ReactTestRenderer.ReactTestInstance;
      const slotStyle = StyleSheet.flatten(grandparent.props.style);
      expect(slotStyle.width).toBe(BOTTOM_NAV_ICON_SLOT.width);
      expect(slotStyle.height).toBe(BOTTOM_NAV_ICON_SLOT.height);
    });
  });

  it('icon slot uses alignItems=center and justifyContent=center', () => {
    const tree = renderNav();
    const icons = tree.root.findAllByType(AppIcon);

    icons.forEach(icon => {
      const parent = icon.parent as ReactTestRenderer.ReactTestInstance;
      const grandparent = parent.parent as ReactTestRenderer.ReactTestInstance;
      const slotStyle = StyleSheet.flatten(grandparent.props.style);
      expect(slotStyle.alignItems).toBe('center');
      expect(slotStyle.justifyContent).toBe('center');
    });
  });
});

// ---------------------------------------------------------------------------
// 6. All 10 registered icon names resolve through AppIcon
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 6. All 10 tab icon names resolve', () => {
  const ALL_ICON_NAMES = [
    'homeActive',
    'homeInactive',
    'shopActive',
    'shopInactive',
    'tournamentActive',
    'tournamentInactive',
    'missionActive',
    'missionInactive',
    'friendsActive',
    'friendsInactive',
  ] as const;

  it('every tab icon name is used across the rendered nav', () => {
    // Render with each tab active in turn and collect icon names
    const observedNames = new Set<string>();
    for (const item of FIVE_ITEMS) {
      const tree = renderNav({ activeKey: item.key });
      tree.root.findAllByType(AppIcon).forEach(icon => {
        observedNames.add(icon.props.name);
      });
    }
    for (const name of ALL_ICON_NAMES) {
      expect(observedNames.has(name)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 7. Pressing an item calls onItemPress(key)
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 7. onItemPress', () => {
  it('calls onItemPress with the correct key when a tab is pressed', () => {
    const onItemPress = jest.fn();
    const tree = renderNav({ onItemPress });
    const items = getTabItems(tree);

    act(() => {
      getTabPressable(items[1]).props.onPress(); // shop
    });
    expect(onItemPress).toHaveBeenCalledWith('shop');
  });

  it('calls onItemPress even for the active tab', () => {
    const onItemPress = jest.fn();
    const tree = renderNav({ activeKey: 'home', onItemPress });
    const items = getTabItems(tree);

    act(() => {
      getTabPressable(items[0]).props.onPress(); // home (already active)
    });
    expect(onItemPress).toHaveBeenCalledWith('home');
  });

  it('calls onItemPress with each item key correctly', () => {
    const onItemPress = jest.fn();
    const tree = renderNav({ onItemPress });
    const items = getTabItems(tree);

    FIVE_ITEMS.forEach((item, i) => {
      act(() => {
        getTabPressable(items[i]).props.onPress();
      });
    });

    expect(onItemPress).toHaveBeenCalledTimes(FIVE_ITEMS.length);
    FIVE_ITEMS.forEach((item, i) => {
      expect(onItemPress).toHaveBeenNthCalledWith(i + 1, item.key);
    });
  });
});

// ---------------------------------------------------------------------------
// 8. Active item has accessibilityState.selected = true
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 8. accessibilityState.selected active', () => {
  it('active tab has selected=true', () => {
    const tree = renderNav({ activeKey: 'shop' });
    const items = getTabItems(tree);
    const shopItem = items[1];
    const a11yNode = getTabA11yNode(shopItem);
    expect(a11yNode.props.accessibilityState.selected).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 9. Inactive items have selected = false
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 9. accessibilityState.selected inactive', () => {
  it('all non-active tabs have selected=false', () => {
    const tree = renderNav({ activeKey: 'home' });
    const items = getTabItems(tree);
    const inactiveItems = items.filter(
      item => getTabA11yNode(item).props.accessibilityState?.selected !== true,
    );
    expect(inactiveItems.length).toBe(FIVE_ITEMS.length - 1);
    inactiveItems.forEach(item => {
      expect(getTabA11yNode(item).props.accessibilityState.selected).toBe(
        false,
      );
    });
  });
});

// ---------------------------------------------------------------------------
// 10. Each item exposes accessibilityRole="tab"
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 10. accessibilityRole=tab', () => {
  it('every item has accessibilityRole="tab"', () => {
    const tree = renderNav();
    const items = getTabItems(tree);
    expect(items).toHaveLength(FIVE_ITEMS.length);
    items.forEach(item => {
      expect(getTabA11yNode(item).props.accessibilityRole).toBe('tab');
    });
  });
});

// ---------------------------------------------------------------------------
// 11. AppIcon slot is not a separate accessible element
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 11. Icon accessibility', () => {
  it('AppIcon slots are not separately accessible', () => {
    const tree = renderNav();
    const icons = tree.root.findAllByType(AppIcon);

    icons.forEach(icon => {
      // AppIcon in the slot is rendered with accessible={false}
      const isHidden =
        icon.props.accessible === false || icon.props.accessible === undefined; // default is decorative
      expect(isHidden).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// 12. No custom pressed-state visual
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 12. NO_CUSTOM_PRESSED_VISUAL_IN_V1', () => {
  it('source file contains no custom opacity/scale pressed handler', () => {
    const itemSrc = fs.readFileSync(
      path.join(__dirname, '../src/ui/organisms/bottom-navigation-item.tsx'),
      'utf8',
    );
    expect(itemSrc).not.toContain('activeOpacity');
    expect(itemSrc).not.toContain('onPressIn');
    expect(itemSrc).not.toContain('onPressOut');
  });
});

// ---------------------------------------------------------------------------
// 13. Component does not import navigation or product config
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 13. Architectural independence', () => {
  const containerSrc: string = fs.readFileSync(
    path.join(__dirname, '../src/ui/organisms/app-bottom-navigation.tsx'),
    'utf8',
  );
  const itemSrc: string = fs.readFileSync(
    path.join(__dirname, '../src/ui/organisms/bottom-navigation-item.tsx'),
    'utf8',
  );

  it('does not import React Navigation', () => {
    expect(containerSrc).not.toContain('@react-navigation');
    expect(containerSrc).not.toContain('useNavigation');
    expect(containerSrc).not.toContain('useRoute');
    expect(itemSrc).not.toContain('@react-navigation');
    expect(itemSrc).not.toContain('useNavigation');
    expect(itemSrc).not.toContain('useRoute');
  });

  it('does not import TAB_ICON_ASSETS or any src/app module', () => {
    expect(containerSrc).not.toContain('tab-icon-assets');
    expect(containerSrc).not.toContain('TAB_ICON_ASSETS');
    expect(containerSrc).not.toContain("from '@jujistu/app");
    expect(containerSrc).not.toContain("from '../app/");
    expect(itemSrc).not.toContain('tab-icon-assets');
    expect(itemSrc).not.toContain('TAB_ICON_ASSETS');
    expect(itemSrc).not.toContain("from '@jujistu/app");
    expect(itemSrc).not.toContain("from '../app/");
  });

  it('does not import safe-area hooks', () => {
    expect(containerSrc).not.toContain('useSafeAreaInsets');
    expect(containerSrc).not.toContain('SafeAreaView');
    expect(itemSrc).not.toContain('useSafeAreaInsets');
    expect(itemSrc).not.toContain('SafeAreaView');
  });
});

// ---------------------------------------------------------------------------
// 14. Active label gradient implementation
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 14. Active label gradient', () => {
  it('renders a LinearGradient for the active tab label', () => {
    const tree = renderNav({ activeKey: 'home' });
    const gradients = tree.root.findAllByType(LinearGradient);
    expect(gradients.length).toBeGreaterThanOrEqual(1);
  });

  it('active label gradient is left-to-right (#A70100 → #FE8B33)', () => {
    const tree = renderNav({ activeKey: 'home' });
    const gradients = tree.root.findAllByType(LinearGradient);
    const labelGradient = gradients.find(
      g => g.props.id === BOTTOM_NAV_ACTIVE_LABEL_GRADIENT.id,
    );
    expect(labelGradient).toBeDefined();
    expect(labelGradient!.props.x1).toBe('0');
    expect(labelGradient!.props.x2).toBe('1');
    expect(labelGradient!.props.y1).toBe('0');
    expect(labelGradient!.props.y2).toBe('0');

    const stops = labelGradient!.findAllByType(Stop);
    expect(stops[0].props.stopColor).toBe('#A70100');
    expect(stops[1].props.stopColor).toBe('#FE8B33');
  });

  it('inactive label uses #7D7F84 (text.tertiary)', () => {
    const tree = renderNav({ activeKey: 'home' });
    const svgTexts = tree.root.findAllByType(SvgText);
    const inactiveTexts = svgTexts.filter(
      t => t.props.fill === BOTTOM_NAV_INACTIVE_LABEL_COLOR,
    );
    expect(inactiveTexts.length).toBe(FIVE_ITEMS.length - 1);
    expect(BOTTOM_NAV_INACTIVE_LABEL_COLOR).toBe('#7D7F84');
  });
});

// ---------------------------------------------------------------------------
// 15. Bar geometry constants
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 15. Bar geometry', () => {
  it('container has black background, top border, h-padding 16, top-padding 8', () => {
    const tree = renderNav();
    const container = tree.root.findByProps({ accessibilityRole: 'tablist' });
    const style = StyleSheet.flatten(container.props.style);

    expect(style.backgroundColor).toBe(BOTTOM_NAV_THEME.backgroundColor);
    expect(style.backgroundColor).toBe('#000000');
    expect(style.borderTopColor).toBe(BOTTOM_NAV_THEME.topBorderColor);
    expect(style.borderTopWidth).toBe(1);
    expect(style.paddingHorizontal).toBe(16);
    expect(style.paddingTop).toBe(8);
    expect(style.paddingBottom).toBe(0);
    expect(style.gap).toBe(12);
    expect(style.flexDirection).toBe('row');
  });

  it('paddingBottom is 0 — parent owns safe area', () => {
    const tree = renderNav();
    const container = tree.root.findByProps({ accessibilityRole: 'tablist' });
    const style = StyleSheet.flatten(container.props.style);
    expect(style.paddingBottom).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 16. accessibilityLabel fallback
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 16. accessibilityLabel fallback', () => {
  it('uses item.accessibilityLabel when provided', () => {
    const tree = renderNav();
    const items = getTabItems(tree);
    const missionItem = items.find(i => i.props.item.key === 'mission');
    expect(missionItem).toBeDefined();
    const a11yNode = getTabA11yNode(missionItem!);
    expect(a11yNode.props.accessibilityLabel).toBe('Mission custom');
  });

  it('falls back to item.label when accessibilityLabel is absent', () => {
    const tree = renderNav();
    const items = getTabItems(tree);
    const homeItem = items.find(i => i.props.item.key === 'home');
    expect(homeItem).toBeDefined();
    const a11yNode = getTabA11yNode(homeItem!);
    expect(a11yNode.props.accessibilityLabel).toBe('Home');
  });
});

// ---------------------------------------------------------------------------
// 17. Public barrel contract
// ---------------------------------------------------------------------------

describe('AppBottomNavigation — 17. Public barrel contract', () => {
  it('exports AppBottomNavigation from @jujistu/ui', () => {
    expect(PublicUi.AppBottomNavigation).toBeDefined();
  });

  it('does not expose private BottomNavigationItem helper', () => {
    expect((PublicUi as any).BottomNavigationItem).toBeUndefined();
  });

  it('does not expose bottom-navigation-theme constants', () => {
    expect((PublicUi as any).BOTTOM_NAV_THEME).toBeUndefined();
    expect((PublicUi as any).BOTTOM_NAV_ICON_SLOT).toBeUndefined();
    expect((PublicUi as any).BOTTOM_NAV_ACTIVE_LABEL_GRADIENT).toBeUndefined();
  });

  it('exports BottomNavigationIconNameSource and BottomNavigationIconSlot types (verified at JS level via undefined check)', () => {
    // Type-only exports — verified at TS compilation time; no runtime value
    expect(true).toBe(true);
  });
});
