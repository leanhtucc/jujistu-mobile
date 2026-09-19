import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import {
  ProductAccountHeader,
  type ProductAccountHeaderProps,
} from '../src/features/home/sections/ProductAccountHeader';
import { AppIcon } from '@jujistu/ui';
import { resolveResponsiveMetrics } from '@jujistu/shared/constants/responsive';
import { resolveBalanceGroupWidth } from '../src/features/home/sections/ProductAccountHeader';

const avatar = { uri: 'https://example.test/account-avatar.png' };

const props: ProductAccountHeaderProps = {
  avatar,
  username: 'Supplied Grappler',
  level: 'Rank supplied by parent',
  primaryBalance: '12,345',
  secondaryBalance: '67,890',
};

function renderHeader() {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(<ProductAccountHeader {...props} />);
  });
  return tree;
}

describe('ProductAccountHeader', () => {
  it('renders the supplied account strings', () => {
    const tree = renderHeader();
    const textValues = tree.root
      .findAllByType(Text)
      .map(node => node.props.children);

    expect(textValues).toEqual(
      expect.arrayContaining([
        props.username,
        props.level,
        props.primaryBalance,
        props.secondaryBalance,
      ]),
    );
  });

  it('renders the parent-provided avatar and bundled level visual', () => {
    const tree = renderHeader();
    const images = tree.root.findAllByType(Image);

    expect(images).toHaveLength(2);
    expect(images.some(image => image.props.source === avatar)).toBe(true);
    expect(
      images.some(
        image =>
          image.props.source !== avatar && image.props.accessible === false,
      ),
    ).toBe(true);
  });

  it('renders the four approved icons at their required sizes', () => {
    const tree = renderHeader();
    const icons = tree.root.findAllByType(AppIcon);

    expect(icons.map(icon => [icon.props.name, icon.props.size])).toEqual([
      ['settings', 12],
      ['gem', 20],
      ['balanceAdd', 13.333],
      ['coin', 20],
      ['balanceAdd', 13.333],
    ]);
  });

  it('preserves the 64px responsive shell and single-line text strategy', () => {
    const tree = renderHeader();
    const root = tree.root.findAllByType(View)[0];
    const rootStyle = StyleSheet.flatten(root.props.style);
    const texts = tree.root.findAllByType(Text);

    expect(rootStyle).toMatchObject({
      width: '100%',
      height: 64,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#030003',
    });
    texts.forEach(text => {
      expect(text.props.numberOfLines).toBe(1);
      expect(text.props.ellipsizeMode).toBe('tail');
    });
  });

  it('layers the Figma-sized level bar beneath the settings accessory', () => {
    const tree = renderHeader();
    const views = tree.root.findAllByType(View);
    const levelSurface = views.find(view => {
      const style = StyleSheet.flatten(view.props.style);
      return style?.left === 27 && style?.height === 15;
    });
    const progressImage = tree.root
      .findAllByType(Image)
      .find(image => image.props.accessible === false)!;
    const levelText = tree.root
      .findAllByType(Text)
      .find(text => text.props.children === props.level)!;

    expect(StyleSheet.flatten(levelSurface!.props.style)).toMatchObject({
      left: 27,
      width: 134,
      borderBottomRightRadius: 16,
    });
    expect(StyleSheet.flatten(progressImage.props.style).width).toBe(86);
    expect(StyleSheet.flatten(levelText.props.style).width).toBe(134);
  });

  it('keeps both balance pills compact on Pixel 8 Pro sized windows', () => {
    const tree = renderHeader();
    const views = tree.root.findAllByType(View);
    const balancePill = views.find(view => {
      const style = StyleSheet.flatten(view.props.style);
      return style?.flex === 1 && style?.height === 28;
    });
    const pillStyle = StyleSheet.flatten(balancePill!.props.style);
    const primaryBalanceText = tree.root
      .findAllByType(Text)
      .find(text => text.props.children === props.primaryBalance)!;
    const balanceTextStyle = StyleSheet.flatten(primaryBalanceText.props.style);
    const pixel8Pro = resolveResponsiveMetrics({
      width: 412,
      height: 892,
      scale: 2.625,
      fontScale: 1,
    });

    expect(resolveBalanceGroupWidth(pixel8Pro)).toBe(164);
    expect(balancePill).toBeDefined();
    expect(pillStyle.flex).toBe(1);
    expect(pillStyle.paddingLeft).toBe(8);
    expect(pillStyle.paddingRight).toBe(16);
    expect(pillStyle.gap).toBe(6);
    expect(pillStyle.justifyContent).toBe('flex-start');
    expect(balanceTextStyle.flexShrink).toBe(1);
  });

  it('is display-only and exposes exactly the required data props', () => {
    const tree = renderHeader();
    expect(tree.root.findAllByType(Pressable)).toHaveLength(0);

    type PropKeys = keyof ProductAccountHeaderProps;
    const propKeys: PropKeys[] = [
      'avatar',
      'username',
      'level',
      'primaryBalance',
      'secondaryBalance',
    ];
    expect(propKeys).toHaveLength(5);
  });
});
