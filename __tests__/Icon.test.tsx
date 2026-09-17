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
    // Unqualified tab names are blocked — only Active/Inactive variants are registered
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

  const SETTINGS_PATH =
    'M7.1904 0.3252C7.2426 0.4266 7.2558 0.5568 7.2816 0.8172C7.3308 1.3092 7.3554 1.5552 7.4586 1.6908C7.5229 1.77499 7.60834 1.84066 7.70625 1.88113C7.80415 1.9216 7.91102 1.93542 8.016 1.9212C8.184 1.899 8.376 1.7424 8.7588 1.4292C8.961 1.263 9.0624 1.1802 9.171 1.1454C9.30932 1.1012 9.45897 1.10866 9.5922 1.1664C9.6972 1.212 9.7902 1.3044 9.9744 1.4892L10.5108 2.0256C10.6956 2.2104 10.788 2.3028 10.8336 2.4078C10.8913 2.54103 10.8988 2.69068 10.8546 2.829C10.8198 2.9376 10.737 3.039 10.5714 3.2412C10.2576 3.6246 10.101 3.816 10.0782 3.9846C10.0642 4.08954 10.0781 4.19632 10.1187 4.29412C10.1593 4.39191 10.225 4.47722 10.3092 4.5414C10.4442 4.6446 10.6908 4.6692 11.1834 4.7184C11.4432 4.7442 11.5734 4.7574 11.6754 4.8096C11.8041 4.87632 11.9042 4.98736 11.9574 5.1222C12 5.2284 12 5.3592 12 5.6208V6.3792C12 6.6408 12 6.7716 11.958 6.8772C11.9047 7.01247 11.804 7.12376 11.6748 7.1904C11.5734 7.2426 11.4432 7.2558 11.1828 7.2816C10.6908 7.3308 10.4448 7.3554 10.3092 7.4586C10.225 7.5229 10.1593 7.60834 10.1189 7.70625C10.0784 7.80415 10.0646 7.91102 10.0788 8.016C10.1016 8.184 10.2582 8.376 10.5714 8.7588C10.737 8.961 10.8198 9.0618 10.8546 9.171C10.8988 9.30932 10.8913 9.45897 10.8336 9.5922C10.788 9.6972 10.6956 9.7896 10.5108 9.9744L9.9744 10.5102C9.7896 10.6956 9.6972 10.788 9.5922 10.833C9.45897 10.8907 9.30932 10.8982 9.171 10.854C9.0624 10.8192 8.961 10.7364 8.7588 10.5708C8.3754 10.2576 8.184 10.101 8.016 10.0788C7.91102 10.0646 7.80415 10.0784 7.70625 10.1189C7.60834 10.1593 7.5229 10.225 7.4586 10.3092C7.3554 10.4442 7.3308 10.6902 7.2816 11.1828C7.2558 11.4432 7.2426 11.5734 7.1904 11.6748C7.12391 11.8039 7.01284 11.9045 6.8778 11.958C6.7716 12 6.6408 12 6.3792 12H5.6208C5.3592 12 5.2284 12 5.1228 11.958C4.98753 11.9047 4.87624 11.804 4.8096 11.6748C4.7574 11.5734 4.7442 11.4432 4.7184 11.1828C4.6692 10.6908 4.6446 10.4448 4.5414 10.3092C4.47715 10.2251 4.39181 10.1595 4.29402 10.119C4.19623 10.0786 4.08948 10.0647 3.9846 10.0788C3.816 10.101 3.6246 10.2576 3.2412 10.5708C3.039 10.737 2.9376 10.8198 2.829 10.8546C2.69068 10.8988 2.54103 10.8913 2.4078 10.8336C2.3028 10.788 2.2098 10.6956 2.0256 10.5108L1.4892 9.9744C1.3044 9.7896 1.212 9.6972 1.1664 9.5922C1.10866 9.45897 1.1012 9.30932 1.1454 9.171C1.1802 9.0624 1.263 8.961 1.4286 8.7588C1.7424 8.3754 1.899 8.184 1.9212 8.0154C1.93531 7.91052 1.92143 7.80377 1.88097 7.70598C1.8405 7.60819 1.7749 7.52285 1.6908 7.4586C1.5558 7.3554 1.3092 7.3308 0.8166 7.2816C0.5568 7.2558 0.4266 7.2426 0.3246 7.1904C0.195928 7.12368 0.0957576 7.01264 0.0426001 6.8778C5.81145e-08 6.7716 0 6.6408 0 6.3792V5.6208C0 5.3592 -4.02331e-08 5.2284 0.042 5.1228C0.0953322 4.98753 0.195969 4.87624 0.3252 4.8096C0.4266 4.7574 0.5568 4.7442 0.8172 4.7184C1.3092 4.6692 1.5558 4.6446 1.6908 4.5414C1.77501 4.47722 1.84073 4.39191 1.8813 4.29412C1.92187 4.19632 1.93585 4.08954 1.9218 3.9846C1.899 3.816 1.7418 3.6246 1.4286 3.2406C1.263 3.0384 1.1802 2.9376 1.1454 2.8284C1.1012 2.69008 1.10866 2.54043 1.1664 2.4072C1.212 2.3028 1.3044 2.2098 1.4892 2.025L2.0256 1.4892C2.2104 1.3044 2.3028 1.2114 2.4078 1.1664C2.54103 1.10866 2.69068 1.1012 2.829 1.1454C2.9376 1.1802 3.039 1.263 3.2412 1.4286C3.6246 1.7418 3.816 1.8984 3.984 1.9212C4.08913 1.93547 4.19616 1.9216 4.29418 1.88102C4.39221 1.84044 4.47772 1.7746 4.542 1.6902C4.644 1.5552 4.6692 1.3092 4.7184 0.8166C4.7442 0.5568 4.7574 0.4266 4.8096 0.3246C4.8762 0.195703 4.98726 0.0953061 5.1222 0.042C5.2284 -4.02331e-08 5.3592 0 5.6208 0H6.3792C6.6408 0 6.7716 -4.02331e-08 6.8772 0.042C7.01247 0.0953322 7.12376 0.195969 7.1904 0.3252ZM6 8.4C6.63652 8.4 7.24697 8.14714 7.69706 7.69706C8.14714 7.24697 8.4 6.63652 8.4 6C8.4 5.36348 8.14714 4.75303 7.69706 4.30294C7.24697 3.85286 6.63652 3.6 6 3.6C5.36348 3.6 4.75303 3.85286 4.30294 4.30294C3.85286 4.75303 3.6 5.36348 3.6 6C3.6 6.63652 3.85286 7.24697 4.30294 7.69706C4.75303 8.14714 5.36348 8.4 6 8.4Z';

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

      type IsSettingsAssignable = ['settings'] extends [IconName]
        ? true
        : false;
      const settingsAssignable: IsSettingsAssignable = true;
      expect(settingsAssignable).toBe(true);

      type IsGemAssignable = ['gem'] extends [IconName] ? true : false;
      const gemAssignable: IsGemAssignable = true;
      expect(gemAssignable).toBe(true);

      type IsCoinAssignable = ['coin'] extends [IconName] ? true : false;
      const coinAssignable: IsCoinAssignable = true;
      expect(coinAssignable).toBe(true);

      type IsBalanceAddAssignable = ['balanceAdd'] extends [IconName]
        ? true
        : false;
      const balanceAddAssignable: IsBalanceAddAssignable = true;
      expect(balanceAddAssignable).toBe(true);

      // Tab icon names — all 10 must now be assignable to IconName
      type IsHomeActiveAssignable = ['homeActive'] extends [IconName]
        ? true
        : false;
      const homeActiveAssignable: IsHomeActiveAssignable = true;
      expect(homeActiveAssignable).toBe(true);

      type IsHomeInactiveAssignable = ['homeInactive'] extends [IconName]
        ? true
        : false;
      const homeInactiveAssignable: IsHomeInactiveAssignable = true;
      expect(homeInactiveAssignable).toBe(true);

      type IsShopActiveAssignable = ['shopActive'] extends [IconName]
        ? true
        : false;
      const shopActiveAssignable: IsShopActiveAssignable = true;
      expect(shopActiveAssignable).toBe(true);

      type IsShopInactiveAssignable = ['shopInactive'] extends [IconName]
        ? true
        : false;
      const shopInactiveAssignable: IsShopInactiveAssignable = true;
      expect(shopInactiveAssignable).toBe(true);

      type IsTournamentActiveAssignable = ['tournamentActive'] extends [
        IconName,
      ]
        ? true
        : false;
      const tournamentActiveAssignable: IsTournamentActiveAssignable = true;
      expect(tournamentActiveAssignable).toBe(true);

      type IsTournamentInactiveAssignable = ['tournamentInactive'] extends [
        IconName,
      ]
        ? true
        : false;
      const tournamentInactiveAssignable: IsTournamentInactiveAssignable = true;
      expect(tournamentInactiveAssignable).toBe(true);

      type IsMissionActiveAssignable = ['missionActive'] extends [IconName]
        ? true
        : false;
      const missionActiveAssignable: IsMissionActiveAssignable = true;
      expect(missionActiveAssignable).toBe(true);

      type IsMissionInactiveAssignable = ['missionInactive'] extends [IconName]
        ? true
        : false;
      const missionInactiveAssignable: IsMissionInactiveAssignable = true;
      expect(missionInactiveAssignable).toBe(true);

      type IsFriendsActiveAssignable = ['friendsActive'] extends [IconName]
        ? true
        : false;
      const friendsActiveAssignable: IsFriendsActiveAssignable = true;
      expect(friendsActiveAssignable).toBe(true);

      type IsFriendsInactiveAssignable = ['friendsInactive'] extends [IconName]
        ? true
        : false;
      const friendsInactiveAssignable: IsFriendsInactiveAssignable = true;
      expect(friendsInactiveAssignable).toBe(true);
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
    it('contains all 16 verified glyphs: 6 shared UI + 10 tab icons', () => {
      const keys = Object.keys(glyphs);
      expect(keys.sort()).toEqual(
        [
          'chevronLeft',
          'logOut',
          'settings',
          'gem',
          'coin',
          'balanceAdd',
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
        ].sort(),
      );
      expect(keys).toHaveLength(16);
      // Shared UI glyphs
      expect(typeof glyphs.chevronLeft).toBe('function');
      expect(typeof glyphs.logOut).toBe('function');
      expect(typeof glyphs.settings).toBe('function');
      expect(typeof glyphs.gem).toBe('function');
      expect(typeof glyphs.coin).toBe('function');
      expect(typeof glyphs.balanceAdd).toBe('function');
      // Tab icon glyphs
      expect(typeof glyphs.homeActive).toBe('function');
      expect(typeof glyphs.homeInactive).toBe('function');
      expect(typeof glyphs.shopActive).toBe('function');
      expect(typeof glyphs.shopInactive).toBe('function');
      expect(typeof glyphs.tournamentActive).toBe('function');
      expect(typeof glyphs.tournamentInactive).toBe('function');
      expect(typeof glyphs.missionActive).toBe('function');
      expect(typeof glyphs.missionInactive).toBe('function');
      expect(typeof glyphs.friendsActive).toBe('function');
      expect(typeof glyphs.friendsInactive).toBe('function');
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

    it('supports fixed-visual glyphs honoring size and preserving original artwork colors', () => {
      const MockFixedVisualGlyph = ({ size, color: _color }: GlyphProps) => (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M0 0h24v24H0z" fill="#BA2025" />
        </Svg>
      );

      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIconPresentation
            Glyph={MockFixedVisualGlyph}
            size={32}
            color="#00FF00"
          />,
        );
      });
      const svg = tree!.root.findByType(Svg);
      const path = tree!.root.findByType(Path);

      expect(svg.props.width).toBe(32);
      expect(svg.props.height).toBe(32);
      expect(path.props.fill).toBe('#BA2025');
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

  describe('I. Verified Glyph: settings', () => {
    it('renders settings using viewBox 0 0 12 12', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppIcon name="settings" />);
      });
      const svg = tree!.root.findByType(Svg);

      expect(svg.props.viewBox).toBe('0 0 12 12');
      expect(svg.props.width).toBe(24);
      expect(svg.props.height).toBe(24);
    });

    it('renders settings with exact verified path data, evenodd fill rule, and default primary icon color', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppIcon name="settings" />);
      });
      const path = tree!.root.findByType(Path);

      expect(path.props.d).toBe(SETTINGS_PATH);
      expect(path.props.fillRule).toBe('evenodd');
      expect(path.props.clipRule).toBe('evenodd');
      expect(path.props.fill).toBe(semanticColors.icon.primary);
    });

    it('forwards custom size and color to settings', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIcon name="settings" size={16} color="#FE8B33" />,
        );
      });
      const svg = tree!.root.findByType(Svg);
      const path = tree!.root.findByType(Path);

      expect(svg.props.width).toBe(16);
      expect(svg.props.height).toBe(16);
      expect(path.props.fill).toBe('#FE8B33');
    });
  });

  describe('J. Verified Header Glyphs: gem, coin, balanceAdd', () => {
    it('renders gem through AppIcon with correct viewBox 0 0 20 20 and forwards size', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIcon name="gem" size={20} color="#FF0000" />,
        );
      });
      const svg = tree!.root.findByType(Svg);
      expect(svg.props.viewBox).toBe('0 0 20 20');
      expect(svg.props.width).toBe(20);
      expect(svg.props.height).toBe(20);
    });

    it('renders coin through AppIcon with correct viewBox 0 0 20 20 and forwards size', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIcon name="coin" size={20} color="#00FF00" />,
        );
      });
      const svg = tree!.root.findByType(Svg);
      expect(svg.props.viewBox).toBe('0 0 20 20');
      expect(svg.props.width).toBe(20);
      expect(svg.props.height).toBe(20);
    });

    it('renders balanceAdd through AppIcon with correct viewBox 0 0 14 14 and forwards size', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppIcon name="balanceAdd" size={14} color="#0000FF" />,
        );
      });
      const svg = tree!.root.findByType(Svg);
      expect(svg.props.viewBox).toBe('0 0 14 14');
      expect(svg.props.width).toBe(14);
      expect(svg.props.height).toBe(14);
    });
  });
});
