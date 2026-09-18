import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { AppGradientTitle } from '@jujistu/ui';

describe('AppGradientTitle', () => {
  it('renders the approved gradient, outline, typography and shadow', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <AppGradientTitle label="JUJITSU CHAMPIONSHIP" />,
      );
    });

    const gradient = tree.root.findByType(LinearGradient);
    const stops = tree.root.findAllByType(Stop);
    const texts = tree.root.findAllByType(SvgText);
    const title = texts.find(text => text.props.stroke === '#000000')!;
    const shadow = texts.find(
      text => text.props.fill === 'rgba(0, 0, 0, 0.35)',
    )!;

    expect(gradient.props).toMatchObject({
      x1: '0%',
      x2: '100%',
      y1: '36.6%',
      y2: '63.4%',
    });
    expect(stops).toHaveLength(13);
    expect(stops[0].props).toMatchObject({
      offset: '0%',
      stopColor: '#4D4D4D',
    });
    expect(stops[12].props).toMatchObject({
      offset: '97.81%',
      stopColor: '#454545',
    });
    expect(title.props).toMatchObject({
      children: 'JUJITSU CHAMPIONSHIP',
      fontSize: 28,
      fontWeight: '400',
      letterSpacing: -0.28,
      stroke: '#000000',
      strokeWidth: 1,
      textAnchor: 'middle',
    });
    expect(texts).toHaveLength(2);
    expect(shadow.props.y).toBe(19.5);
  });

  it('can render the loading title without outline or shadow', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <AppGradientTitle
          fontSize={32}
          label="WELCOME"
          letterSpacing={0}
          lineHeight={40}
          shadow={false}
          strokeWidth={0}
        />,
      );
    });

    expect(tree.root.findAllByType(SvgText)).toHaveLength(1);
    expect(tree.root.findByType(SvgText).props).toMatchObject({
      children: 'WELCOME',
      fontSize: 32,
      letterSpacing: 0,
      strokeWidth: 0,
    });
  });
});
