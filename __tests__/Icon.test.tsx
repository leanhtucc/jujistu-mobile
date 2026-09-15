import React from 'react';
import { View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import Svg, { G, Path } from 'react-native-svg';

import { AppIcon } from '@jujistu/ui';
import type { GlyphProps, IconName } from '@jujistu/ui';
import * as PublicUi from '@jujistu/ui';
import { AppIconPresentation } from '../src/ui/atoms/icon/app-icon';
import { glyphs } from '../src/ui/atoms/icon/glyphs';
import { semanticColors } from '../src/shared/theme/semantic/colors';

describe('AppIcon Infrastructure & Registry Safety', () => {
  // Test fixture glyph to verify presentation and accessibility contract without mutating production registry
  const MockGlyph = ({ size, color }: GlyphProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" testID="mock-svg">
      <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color} />
    </Svg>
  );

  const BLOCKED_CANDIDATE_GLYPHS = [
    'trophy',
    'search',
    'Search-o',
    'searchO',
    'close',
    'close-circle',
    'alert-circle',
    'eye',
    'eye-off',
    'home',
    'home-filled',
    'tournament',
    'tournament-filled',
    'shop',
    'mission',
    'friends',
  ] as const;

  const CHEVRON_LEFT_PATH =
    'M 7.707108020782471 0.29289332032203674 C 8.097631931304932 0.6834176182746887 8.097631931304932 1.316582590341568 7.7071075439453125 1.7071068286895752 L 2.4142136573791504 7.000000476837158 L 7.707106590270996 12.292893409729004 C 8.097630977630615 12.683417320251465 8.097630977630615 13.316582679748535 7.707106590270996 13.707106590270996 C 7.316582679748535 14.097631454467773 6.683417320251465 14.097631454467773 6.292893409729004 13.707106590270996 L 0.2928932309150696 7.707106590270996 C 0.10535681247711182 7.519570350646973 0 7.26521635055542 0 7 C 0 6.73478364944458 0.10535687208175659 6.480429649353027 0.29289329051971436 6.292892932891846 L 6.29289436340332 0.2928932011127472 C 6.6834187507629395 -0.0976310670375824 7.316583633422852 -0.0976310670375824 7.707108020782471 0.29289332032203674 Z';

  const LOG_OUT_PATH_1 =
    'M 0.8786795735359192 0.8786795735359192 C 1.4412888288497925 0.3160703182220459 2.204350709915161 0 3 0 L 7 0 C 7.5522847175598145 0 8 0.44771522283554077 8 1 L 8 7 L 7 7 C 5.343145847320557 7 4 8.343145370483398 4 10 C 4 11.656854629516602 5.343145847320557 13 7 13 L 8 13 L 8 19 C 8 19.552284240722656 7.5522847175598145 20 7 20 L 3 20 C 2.204349994659424 20 1.4412884712219238 19.683929443359375 0.8786795735359192 19.121320724487305 C 0.3160704970359802 18.5587100982666 0 17.795650482177734 0 17 L 0 3 C 0 2.204350709915161 0.3160703182220459 1.4412888288497925 0.8786795735359192 0.8786795735359192 Z';

  const LOG_OUT_PATH_2 =
    'M 14.707106590270996 4.292893409729004 C 14.316582679748535 3.9023690223693848 13.683417320251465 3.9023690223693848 13.292893409729004 4.292893409729004 C 12.902368545532227 4.683417320251465 12.902368545532227 5.316582679748535 13.292893409729004 5.707106590270996 L 16.585786819458008 9 L 7 9 C 6.4477152824401855 9 6 9.447715759277344 6 10 C 6 10.552284240722656 6.4477152824401855 11 7 11 L 16.585786819458008 11 L 13.292893409729004 14.292893409729004 C 12.902368545532227 14.683417320251465 12.902368545532227 15.316582679748535 13.292893409729004 15.707106590270996 C 13.683417320251465 16.097631454467773 14.316582679748535 16.097631454467773 14.707106590270996 15.707106590270996 L 19.707107543945312 10.707106590270996 C 20.097631454467773 10.316582679748535 20.097631454467773 9.683417320251465 19.707107543945312 9.292893409729004 L 14.707106590270996 4.292893409729004 Z';

  describe('A. Public IconName is derived from implemented registry', () => {
    it('statically derives IconName from keyof typeof glyphs', () => {
      type DerivedFromRegistry = [IconName] extends [keyof typeof glyphs]
        ? true
        : false;
      const isDerived: DerivedFromRegistry = true;
      expect(isDerived).toBe(true);

      type IsChevronLeftAssignable = ['chevronLeft'] extends [IconName]
        ? true
        : false;
      const chevronLeftAssignable: IsChevronLeftAssignable = true;
      expect(chevronLeftAssignable).toBe(true);

      type IsLogOutAssignable = ['logOut'] extends [IconName] ? true : false;
      const logOutAssignable: IsLogOutAssignable = true;
      expect(logOutAssignable).toBe(true);
    });

    it('verifies blocked glyphs are not assignable to IconName', () => {
      type IsSearchAssignable = ['search'] extends [IconName] ? true : false;
      const searchAssignable: IsSearchAssignable = false;
      expect(searchAssignable).toBe(false);

      type IsTrophyAssignable = ['trophy'] extends [IconName] ? true : false;
      const trophyAssignable: IsTrophyAssignable = false;
      expect(trophyAssignable).toBe(false);

      type IsSearchOAssignable = ['Search-o'] extends [IconName] ? true : false;
      const searchOAssignable: IsSearchOAssignable = false;
      expect(searchOAssignable).toBe(false);
    });
  });

  describe('B. Blocked candidate names are NOT in registry', () => {
    it('verifies none of the blocked candidate glyphs exist in the registry', () => {
      for (const candidate of BLOCKED_CANDIDATE_GLYPHS) {
        expect(candidate in glyphs).toBe(false);
        expect((glyphs as Record<string, unknown>)[candidate]).toBeUndefined();
      }
    });

    it('specifically confirms trophy, search, and Search-o are not present', () => {
      expect('trophy' in glyphs).toBe(false);
      expect('search' in glyphs).toBe(false);
      expect('Search-o' in glyphs).toBe(false);
      expect('searchO' in glyphs).toBe(false);
    });
  });

  describe('C. Production registry contains exactly the verified glyphs', () => {
    it('contains chevronLeft and logOut with length 2', () => {
      const keys = Object.keys(glyphs);
      expect(keys.sort()).toEqual(['chevronLeft', 'logOut'].sort());
      expect(keys).toHaveLength(2);
      expect(typeof glyphs.chevronLeft).toBe('function');
      expect(typeof glyphs.logOut).toBe('function');
    });
  });

  describe('D. No placeholder glyphs exist', () => {
    it('contains zero placeholder, null, or undefined values in glyphs object', () => {
      for (const [key, value] of Object.entries(glyphs)) {
        expect(value).toBeDefined();
        expect(typeof value).toBe('function');
        expect(key).toBeTruthy();
      }
    });
  });

  describe('E. No runtime mutable registration API is publicly exported and glyphs is not public', () => {
    it('ensures registerGlyph and unregisterGlyph are not exported from the public UI API', () => {
      expect((PublicUi as any).registerGlyph).toBeUndefined();
      expect((PublicUi as any).unregisterGlyph).toBeUndefined();
    });

    it('ensures glyphs registry is not exposed through the preferred public barrels', () => {
      expect((PublicUi as any).glyphs).toBeUndefined();
    });
  });

  describe('Defensive Runtime Guard', () => {
    it('returns null safely when an unverified or dynamic icon name is passed', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          React.createElement(AppIcon as any, {
            name: 'unverified-dynamic-name',
          }),
        );
      });
      expect(tree!.toJSON()).toBeNull();
    });
  });

  describe('F. Verified Glyph: chevronLeft', () => {
    it('renders chevronLeft using viewBox 0 0 24 24 and verified transform', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppIcon name="chevronLeft" />);
      });
      const svg = tree!.root.findByType(Svg);
      const g = tree!.root
        .findAllByType(G)
        .find(node => Boolean(node.props.transform));

      expect(svg.props.viewBox).toBe('0 0 24 24');
      expect(svg.props.width).toBe(24);
      expect(svg.props.height).toBe(24);
      expect(g).toBeDefined();
      expect(g!.props.transform).toBe('translate(8 5.000000476837158)');
    });

    it('renders chevronLeft with exact verified path data and evenodd fill rule', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppIcon name="chevronLeft" />);
      });
      const path = tree!.root.findByType(Path);

      expect(path.props.d).toBe(CHEVRON_LEFT_PATH);
      expect(path.props.fillRule).toBe('evenodd');
      expect(path.props.fill).toBe(semanticColors.icon.primary);
    });

    it('forwards custom size and color to chevronLeft', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIcon name="chevronLeft" size={20} color="#FF0000" />,
        );
      });
      const svg = tree!.root.findByType(Svg);
      const path = tree!.root.findByType(Path);

      expect(svg.props.width).toBe(20);
      expect(svg.props.height).toBe(20);
      expect(path.props.fill).toBe('#FF0000');
    });
  });

  describe('G. Verified Glyph: logOut', () => {
    it('renders logOut using viewBox 0 0 24 24 and verified transform', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppIcon name="logOut" />);
      });
      const svg = tree!.root.findByType(Svg);
      const g = tree!.root
        .findAllByType(G)
        .find(node => Boolean(node.props.transform));

      expect(svg.props.viewBox).toBe('0 0 24 24');
      expect(svg.props.width).toBe(24);
      expect(svg.props.height).toBe(24);
      expect(g).toBeDefined();
      expect(g!.props.transform).toBe('translate(2 2)');
    });

    it('renders logOut containing exactly the two verified vector paths with nonzero fill rule', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppIcon name="logOut" />);
      });
      const paths = tree!.root.findAllByType(Path);

      expect(paths).toHaveLength(2);
      expect(paths[0].props.d).toBe(LOG_OUT_PATH_1);
      expect(paths[0].props.fillRule).toBe('nonzero');
      expect(paths[0].props.fill).toBe(semanticColors.icon.primary);

      expect(paths[1].props.d).toBe(LOG_OUT_PATH_2);
      expect(paths[1].props.fillRule).toBe('nonzero');
      expect(paths[1].props.fill).toBe(semanticColors.icon.primary);
    });

    it('forwards custom size and color to logOut', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIcon name="logOut" size={20} color="#00FF00" />,
        );
      });
      const svg = tree!.root.findByType(Svg);
      const paths = tree!.root.findAllByType(Path);

      expect(svg.props.width).toBe(20);
      expect(svg.props.height).toBe(20);
      expect(paths[0].props.fill).toBe('#00FF00');
      expect(paths[1].props.fill).toBe('#00FF00');
    });
  });

  describe('H. Accessibility & Presentation Contract', () => {
    it('renders a glyph when provided to AppIconPresentation fixture', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIconPresentation Glyph={MockGlyph} />,
        );
      });
      expect(tree!.toJSON()).not.toBeNull();
    });

    it('applies default size 24 and default color colors.icon.primary (#FFFFFF)', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIconPresentation Glyph={MockGlyph} />,
        );
      });
      const svg = tree!.root.findByType(Svg);
      const path = tree!.root.findByType(Path);

      expect(svg.props.width).toBe(24);
      expect(svg.props.height).toBe(24);
      expect(path.props.fill).toBe(semanticColors.icon.primary);
      expect(path.props.fill).toBe('#FFFFFF');
    });

    it('passes custom numeric size to Svg width and height', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIconPresentation Glyph={MockGlyph} size={32} />,
        );
      });
      const svg = tree!.root.findByType(Svg);

      expect(svg.props.width).toBe(32);
      expect(svg.props.height).toBe(32);
    });

    it('passes custom color to appropriate Svg fill/stroke', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIconPresentation
            Glyph={MockGlyph}
            color={semanticColors.icon.secondary}
          />,
        );
      });
      const path = tree!.root.findByType(Path);

      expect(path.props.fill).toBe(semanticColors.icon.secondary);
      expect(path.props.fill).toBe('#C2C2C2');
    });

    it('marks decorative icons as hidden from accessibility by default', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppIcon name="chevronLeft" />);
      });
      const root = tree!.root.findByType(View);

      expect(root.props.accessible).toBe(false);
      expect(root.props.importantForAccessibility).toBe('no');
      expect(root.props.accessibilityElementsHidden).toBe(true);
    });

    it('sets accessibilityLabel and accessible=true when label is provided', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIcon name="chevronLeft" accessibilityLabel="Quay lại" />,
        );
      });
      const root = tree!.root.findByType(View);

      expect(root.props.accessible).toBe(true);
      expect(root.props.accessibilityLabel).toBe('Quay lại');
      expect(root.props.importantForAccessibility).toBe('yes');
      expect(root.props.accessibilityElementsHidden).toBe(false);
    });

    it('does not include interactive props on presentation layer (no onPress, hitSlop, or button role)', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppIcon name="logOut" />);
      });
      const root = tree!.root.findByType(View);

      expect(root.props.onPress).toBeUndefined();
      expect(root.props.hitSlop).toBeUndefined();
      expect(root.props.accessibilityRole).toBeUndefined();
    });
  });
});
