declare const require: (module: string) => any;
declare const __dirname: string;

const fs = require('fs');
const path = require('path');

import {
  BOTTOM_NAVIGATION_ITEMS,
  type BottomNavigationProductKey,
} from '../src/app/navigation/bottom-navigation-items';
import { TAB_ICON_ASSETS } from '../src/app/navigation/tab-icon-assets';

const EXPECTED_KEYS: readonly BottomNavigationProductKey[] = [
  'home',
  'shop',
  'tournament',
  'mission',
  'friends',
];

const EXPECTED_LABELS = [
  'Trang chủ',
  'Shop',
  'Giải đấu',
  'Nhiệm vụ',
  'Bạn bè',
] as const;

describe('BOTTOM_NAVIGATION_ITEMS', () => {
  it('defines the five product items in canonical visual order', () => {
    expect(BOTTOM_NAVIGATION_ITEMS).toHaveLength(5);
    expect(BOTTOM_NAVIGATION_ITEMS.map(item => item.key)).toEqual(
      EXPECTED_KEYS,
    );
    expect(BOTTOM_NAVIGATION_ITEMS.map(item => item.label)).toEqual(
      EXPECTED_LABELS,
    );
  });

  it.each(EXPECTED_KEYS)('maps %s to its canonical icon assets', key => {
    const item = BOTTOM_NAVIGATION_ITEMS.find(
      candidate => candidate.key === key,
    );

    expect(item?.activeIcon).toBe(TAB_ICON_ASSETS[key].active);
    expect(item?.inactiveIcon).toBe(TAB_ICON_ASSETS[key].inactive);
  });

  it('does not contain duplicate keys', () => {
    const keys = BOTTOM_NAVIGATION_ITEMS.map(item => item.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it('contains no navigation or runtime selection fields', () => {
    const forbiddenFields = [
      'route',
      'routeName',
      'screen',
      'component',
      'onPress',
      'active',
      'selected',
    ] as const;

    for (const item of BOTTOM_NAVIGATION_ITEMS) {
      for (const field of forbiddenFields) {
        expect(field in item).toBe(false);
      }
    }
  });

  it('uses the public UI type boundary', () => {
    const sourcePath = path.resolve(
      __dirname,
      '../src/app/navigation/bottom-navigation-items.ts',
    );
    const source = fs.readFileSync(sourcePath, 'utf8');

    expect(source).toMatch(
      /import type \{ BottomNavigationItemData \} from '@jujistu\/ui';/,
    );
    expect(source).not.toMatch(/(?:src\/ui|@jujistu\/ui)\/organisms/);
  });
});
