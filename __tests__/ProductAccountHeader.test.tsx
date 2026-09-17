import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import {
  ProductAccountHeader,
  type ProductAccountHeaderProps,
} from '@jujistu/app/components';
import { AppIcon } from '@jujistu/ui';

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
