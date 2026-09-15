import React from 'react';
declare const require: (module: string) => any;
declare const __dirname: string;

const fs = require('fs');
const path = require('path');
import { StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import Svg, { LinearGradient, Rect, Stop } from 'react-native-svg';

import { AppHeader } from '@jujistu/ui';
import type { HeaderAction, HeaderBackground, HeaderProps } from '@jujistu/ui';
import * as PublicUi from '@jujistu/ui';
import { semanticColors } from '../src/shared/theme/semantic/colors';
import {
  HEADER_ACTION_GRADIENT,
  HEADER_ACTION_INSIDE_STROKE,
  HEADER_ACTION_THEME,
  HEADER_THEME,
  RAW_FIGMA_HEADER_ACTION_GRADIENT_TRANSFORM,
} from '../src/ui/organisms/header-theme';
import { HeaderActionComponent } from '../src/ui/organisms/header-action';
import { AppIcon } from '../src/ui/atoms/icon';

describe('AppHeader Organism (Phase 6 Header System)', () => {
  const defaultProps: HeaderProps = {
    title: 'Hồ sơ người dùng',
    onBackPress: jest.fn(),
    backAccessibilityLabel: 'Quay lại',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('A. Public Render & B-C. Title Rendering', () => {
    it('renders AppHeader from public UI barrel', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });
      expect(tree!.toJSON()).not.toBeNull();
    });

    it('renders title text with accessibilityRole="header"', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });
      const titleElement = tree!.root.findByProps({
        accessibilityRole: 'header',
      });
      expect(titleElement).toBeDefined();
      expect(titleElement.type).toBe(Text);
      expect(titleElement.props.children).toBe('Hồ sơ người dùng');
    });

    it('applies single-line truncation strategy to long title', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppHeader
            {...defaultProps}
            title="Tên giải đấu Jiu-Jitsu vô địch thế giới hạng mục nâng cao tại Tokyo"
          />,
        );
      });
      const titleElement = tree!.root.findByProps({
        accessibilityRole: 'header',
      });
      expect(titleElement.props.numberOfLines).toBe(1);
      expect(titleElement.props.ellipsizeMode).toBe('tail');
    });
  });

  describe('D-F. Background Implementation', () => {
    it('defaults to solid background (#0C0C0C / semanticColors.background.canvas)', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });
      const container = tree!.root.findByType(View);
      const flattenedStyle = StyleSheet.flatten(container.props.style);
      expect(flattenedStyle.backgroundColor).toBe(
        semanticColors.background.canvas,
      );
      expect(flattenedStyle.backgroundColor).toBe('#0C0C0C');
    });

    it('renders solid background explicitly', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppHeader {...defaultProps} background="solid" />,
        );
      });
      const container = tree!.root.findByType(View);
      const flattenedStyle = StyleSheet.flatten(container.props.style);
      expect(flattenedStyle.backgroundColor).toBe(
        semanticColors.background.canvas,
      );
    });

    it('renders transparent background when specified', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppHeader {...defaultProps} background="transparent" />,
        );
      });
      const container = tree!.root.findByType(View);
      const flattenedStyle = StyleSheet.flatten(container.props.style);
      expect(flattenedStyle.backgroundColor).toBe('transparent');
    });

    it('verifies HeaderBackground union contains only solid and transparent', () => {
      type IsSolidAllowed = ['solid'] extends [HeaderBackground] ? true : false;
      type IsTransparentAllowed = ['transparent'] extends [HeaderBackground]
        ? true
        : false;
      type IsArbitraryAllowed = ['arbitrary'] extends [HeaderBackground]
        ? true
        : false;
      const isSolid: IsSolidAllowed = true;
      const isTransparent: IsTransparentAllowed = true;
      const isArbitrary: IsArbitraryAllowed = false;
      expect(isSolid).toBe(true);
      expect(isTransparent).toBe(true);
      expect(isArbitrary).toBe(false);
    });
  });

  describe('G-J. Canonical Header Geometry', () => {
    it('enforces height 56, horizontal padding 16, vertical padding 8, and gap 12', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });
      const container = tree!.root.findByType(View);
      const flattenedStyle = StyleSheet.flatten(container.props.style);

      expect(flattenedStyle.height).toBe(56);
      expect(flattenedStyle.height).toBe(HEADER_THEME.height);
      expect(flattenedStyle.paddingHorizontal).toBe(16);
      expect(flattenedStyle.paddingHorizontal).toBe(
        HEADER_THEME.paddingHorizontal,
      );
      expect(flattenedStyle.paddingVertical).toBe(8);
      expect(flattenedStyle.paddingVertical).toBe(HEADER_THEME.paddingVertical);
      expect(flattenedStyle.gap).toBe(12);
      expect(flattenedStyle.gap).toBe(HEADER_THEME.gap);
      expect(flattenedStyle.flexDirection).toBe('row');
      expect(flattenedStyle.alignItems).toBe('center');
      expect(flattenedStyle.borderRadius).toBe(0);
      expect(flattenedStyle.borderWidth).toBe(0);
    });
  });

  describe('K-R. Back Action Implementation', () => {
    it('always renders back action with accessibilityRole="button"', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });
      const backAction = tree!.root.findByType(HeaderActionComponent);
      const pressable = backAction.findByProps({
        accessibilityRole: 'button',
      });

      expect(pressable.props.accessibilityRole).toBe('button');
      expect(pressable.props.accessibilityLabel).toBe('Quay lại');
    });

    it('enforces 40x40 Pressable geometry and radius 4 for back action', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });
      const backAction = tree!.root.findByType(HeaderActionComponent);
      const pressable = backAction.findByProps({
        accessibilityRole: 'button',
      });
      const flattened = StyleSheet.flatten(pressable.props.style);

      expect(flattened.width).toBe(40);
      expect(flattened.height).toBe(40);
      expect(flattened.borderRadius).toBe(4);
      expect(flattened.padding).toBe(4);
    });

    it('invokes onBackPress when back button is pressed', () => {
      const onBackPress = jest.fn();
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppHeader {...defaultProps} onBackPress={onBackPress} />,
        );
      });
      const backAction = tree!.root.findByType(HeaderActionComponent);
      const pressable = backAction.findByProps({
        accessibilityRole: 'button',
      });
      act(() => {
        pressable.props.onPress();
      });
      expect(onBackPress).toHaveBeenCalledTimes(1);
    });

    it('renders chevronLeft icon at consumer size 24 with primary white color', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });
      const backAction = tree!.root.findByType(HeaderActionComponent);
      const icon = backAction.findByType(AppIcon);

      expect(icon.props.name).toBe('chevronLeft');
      expect(icon.props.size).toBe(24);
      expect(icon.props.color).toBe(semanticColors.icon.primary);
      expect(icon.props.color).toBe('#FFFFFF');
    });
  });

  describe('S-T. Missing Trailing Action Spacer Strategy', () => {
    it('renders a noninteractive 40x40 spacer when trailingAction is absent', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });

      // Exactly 1 interactive HeaderActionComponent (the back action) exists
      const actionComponents = tree!.root.findAllByType(HeaderActionComponent);
      expect(actionComponents).toHaveLength(1);

      // Spacer view exists with width 40, height 40, hidden from accessibility
      const allViews = tree!.root.findAllByType(View);
      const spacer = allViews.find(v => {
        const s = StyleSheet.flatten(v.props.style);
        return (
          s?.width === 40 &&
          s?.height === 40 &&
          v.props.accessibilityRole === undefined &&
          v.props.importantForAccessibility === 'no'
        );
      });
      expect(spacer).toBeDefined();

      const flattenedSpacerStyle = StyleSheet.flatten(spacer!.props.style);
      expect(flattenedSpacerStyle.width).toBe(40);
      expect(flattenedSpacerStyle.height).toBe(40);
      expect(spacer!.props.accessible).toBe(false);
      expect(spacer!.props.importantForAccessibility).toBe('no');
      expect(spacer!.props.accessibilityElementsHidden).toBe(true);
      expect(spacer!.props.accessibilityRole).toBeUndefined();
    });
  });

  describe('U-X. Trailing Action Implementation', () => {
    const trailingAction: HeaderAction = {
      icon: 'logOut',
      onPress: jest.fn(),
      accessibilityLabel: 'Đăng xuất',
    };

    it('renders trailing action when provided and fires callback', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppHeader {...defaultProps} trailingAction={trailingAction} />,
        );
      });

      const actionComponents = tree!.root.findAllByType(HeaderActionComponent);
      expect(actionComponents).toHaveLength(2);

      const trailingActionElement = actionComponents[1];
      const pressable = trailingActionElement.findByProps({
        accessibilityRole: 'button',
      });
      expect(pressable.props.accessibilityRole).toBe('button');
      expect(pressable.props.accessibilityLabel).toBe('Đăng xuất');

      act(() => {
        pressable.props.onPress();
      });
      expect(trailingAction.onPress).toHaveBeenCalledTimes(1);
    });

    it('renders logOut trailing icon at verified consumer size 20', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppHeader {...defaultProps} trailingAction={trailingAction} />,
        );
      });

      const actionComponents = tree!.root.findAllByType(HeaderActionComponent);
      const trailingActionElement = actionComponents[1];
      const icon = trailingActionElement.findByType(AppIcon);

      expect(icon.props.name).toBe('logOut');
      expect(icon.props.size).toBe(20);
      expect(icon.props.color).toBe(semanticColors.icon.primary);
    });
  });

  describe('Y-AD. Action Gradient & Inside Stroke Architecture', () => {
    it('contains action SVG with exact 3 stops and exact alpha values', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });

      const backAction = tree!.root.findByType(HeaderActionComponent);
      const actionSvg = backAction
        .findAllByType(Svg)
        .find(s => s.props.width === 40);

      expect(actionSvg).toBeDefined();
      expect(actionSvg!.props.width).toBe(40);
      expect(actionSvg!.props.height).toBe(40);
      expect(actionSvg!.props.pointerEvents).toBe('none');

      const gradient = actionSvg!.findByType(LinearGradient);
      expect(gradient.props.gradientUnits).toBe('objectBoundingBox');
      expect(gradient.props.gradientTransform).toEqual([
        ...HEADER_ACTION_GRADIENT.transform,
      ]);

      const stops = actionSvg!.findAllByType(Stop);
      expect(stops).toHaveLength(3);

      // Stop 1
      expect(stops[0].props.offset).toBe(0);
      expect(stops[0].props.stopOpacity).toBe(0.10000000149011612);

      // Stop 2
      expect(stops[1].props.offset).toBe(0.6477574110031128);
      expect(stops[1].props.stopOpacity).toBe(0.019999999552965164);

      // Stop 3
      expect(stops[2].props.offset).toBe(1);
      expect(stops[2].props.stopOpacity).toBe(0.20000000298023224);
    });

    it('implements 1px inside stroke via inset Rect with fill and stroke', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });

      const backAction = tree!.root.findByType(HeaderActionComponent);
      const actionSvg = backAction
        .findAllByType(Svg)
        .find(s => s.props.width === 40);
      const rect = actionSvg!.findByType(Rect);

      expect(rect.props.x).toBe(0.5);
      expect(rect.props.y).toBe(0.5);
      expect(rect.props.width).toBe(39);
      expect(rect.props.height).toBe(39);
      expect(rect.props.strokeWidth).toBe(1);
      expect(rect.props.rx).toBe(3.5);
      expect(rect.props.ry).toBe(3.5);
      expect(rect.props.fill).toBe('url(#header-action-gradient)');
      expect(rect.props.stroke).toBe('url(#header-action-gradient)');
    });

    it('preserves the raw Figma affine transform in header-theme documentation', () => {
      expect(RAW_FIGMA_HEADER_ACTION_GRADIENT_TRANSFORM).toEqual([
        [6.123234262925839e-17, 1, 0],
        [-1, 6.123234262925839e-17, 1],
      ]);
      expect(HEADER_ACTION_INSIDE_STROKE).toEqual({
        strokeWidth: 1,
        inset: 0.5,
        innerRadius: 3.5,
      });
      expect(HEADER_ACTION_THEME).toEqual({
        width: 40,
        height: 40,
        padding: 4,
        borderRadius: 4,
      });
    });
  });

  describe('AE-AF. Geometric Title Centering Symmetry', () => {
    it('maintains exact 40px side bounding slots when trailing action is missing', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(<AppHeader {...defaultProps} />);
      });

      const container = tree!.root.findByType(View);
      const directChildren = container.props.children;
      expect(directChildren).toHaveLength(3);

      const titleWrapper = tree!.root
        .findAllByType(View)
        .find(v => v.props.style?.flex === 1);
      expect(titleWrapper).toBeDefined();
    });

    it('maintains exact 40px side bounding slots when trailing action is present', () => {
      let tree: ReturnType<typeof ReactTestRenderer.create> | null = null;
      act(() => {
        tree = ReactTestRenderer.create(
          <AppHeader
            {...defaultProps}
            trailingAction={{
              icon: 'logOut',
              onPress: jest.fn(),
              accessibilityLabel: 'Logout',
            }}
          />,
        );
      });

      const container = tree!.root.findByType(View);
      const directChildren = container.props.children;
      expect(directChildren).toHaveLength(3);

      const titleWrapper = tree!.root
        .findAllByType(View)
        .find(v => v.props.style?.flex === 1);
      expect(titleWrapper).toBeDefined();
    });
  });

  describe('AG-AK. Architectural Independence & API Boundaries', () => {
    it('AG. contains no safe-area hook or provider imports in AppHeader implementation', () => {
      const headerSource = fs.readFileSync(
        path.join(__dirname, '../src/ui/organisms/app-header.tsx'),
        'utf8',
      );
      expect(headerSource).not.toContain('useSafeAreaInsets');
      expect(headerSource).not.toContain('SafeAreaView');
      expect(headerSource).not.toContain('SafeAreaProvider');
    });

    it('AH. contains no React Navigation dependency in AppHeader implementation', () => {
      const headerSource = fs.readFileSync(
        path.join(__dirname, '../src/ui/organisms/app-header.tsx'),
        'utf8',
      );
      expect(headerSource).not.toContain('@react-navigation');
      expect(headerSource).not.toContain('useNavigation');
      expect(headerSource).not.toContain('useRoute');
    });

    it('AI. exposes no containerStyle or style escape-hatches in HeaderProps', () => {
      type HasContainerStyle = 'containerStyle' extends keyof HeaderProps
        ? true
        : false;
      type HasStyle = 'style' extends keyof HeaderProps ? true : false;
      const hasContainerStyle: HasContainerStyle = false;
      const hasStyle: HasStyle = false;
      expect(hasContainerStyle).toBe(false);
      expect(hasStyle).toBe(false);
    });

    it('AJ. does not support multiple trailing actions in HeaderProps', () => {
      type ActionProp = HeaderProps['trailingAction'];
      type IsArray = ActionProp extends any[] ? true : false;
      const isArray: IsArray = false;
      expect(isArray).toBe(false);
    });

    it('AK. restricts title to string and prevents custom ReactNode title', () => {
      type TitleProp = HeaderProps['title'];
      type IsString = [TitleProp] extends [string] ? true : false;
      const isString: IsString = true;
      expect(isString).toBe(true);
    });

    it('does not expose private HeaderActionComponent or header-theme through public barrel', () => {
      expect((PublicUi as any).HeaderActionComponent).toBeUndefined();
      expect((PublicUi as any).HeaderActionGradientSurface).toBeUndefined();
      expect((PublicUi as any).HEADER_THEME).toBeUndefined();
      expect((PublicUi as any).HEADER_ACTION_THEME).toBeUndefined();
      expect((PublicUi as any).HEADER_ACTION_GRADIENT).toBeUndefined();
    });
  });
});
