import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import Svg, { Path } from 'react-native-svg';

import { AppIcon } from '@jujistu/ui';

describe('MailGlyph', () => {
  it('renders the exact filled envelope exported from Figma', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <AppIcon color="#9E9E9E" name="mail" size={20} />,
      );
    });

    expect(tree.root.findByType(Svg).props).toMatchObject({
      height: 20,
      viewBox: '0 0 22 18',
      width: 20,
    });
    const paths = tree.root.findAllByType(Path);
    expect(paths).toHaveLength(2);
    expect(paths.every(path => path.props.fill === '#9E9E9E')).toBe(true);
  });
});
