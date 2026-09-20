import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import Svg, { Rect, Image } from 'react-native-svg';

import { HomeActiveGlyph } from '../src/ui/atoms/icon/glyphs/tabs/home-active';

describe('HomeActiveGlyph', () => {
  it('renders the SVG active-state artwork from downloaded Figma SVG', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <HomeActiveGlyph color="#FE8B33" size={27} />,
      );
    });

    const svg = tree.root.findByType(Svg);
    expect(svg.props.width).toBe(27);
    expect(svg.props.height).toBe(27);
    expect(svg.props.viewBox).toBe('0 0 27 23');

    const rect = tree.root.findByType(Rect);
    expect(rect.props.width).toBe(27);
    expect(rect.props.height).toBe(23);

    const image = tree.root.findByType(Image);
    expect(image.props.width).toBe(257);
    expect(image.props.height).toBe(211);
    expect(image.props.xlinkHref).toContain('data:image/png;base64');
  });
});
