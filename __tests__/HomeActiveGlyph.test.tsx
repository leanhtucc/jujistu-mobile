import React from 'react';
import { Image, StyleSheet } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { HomeActiveGlyph } from '../src/ui/atoms/icon/glyphs/tabs/home-active';

describe('HomeActiveGlyph', () => {
  it('renders the coloured Figma active-state artwork at the verified 27x23 ratio', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <HomeActiveGlyph color="#FE8B33" size={27} />,
      );
    });

    const image = tree.root.findByType(Image);
    const style = StyleSheet.flatten(image.props.style);

    expect(image.props.source).toBeDefined();
    expect(image.props.resizeMode).toBe('contain');
    expect(style.width).toBe(27);
    expect(style.height).toBeCloseTo(23);
  });
});
