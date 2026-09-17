import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Polygon } from 'react-native-svg';

import { AppTooltip } from '@jujistu/ui';
import type { TooltipProps } from '@jujistu/ui';

function renderTooltip(props: Partial<TooltipProps> = {}) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <AppTooltip text="Helpful tip" {...props} />,
    );
  });
  return tree;
}

describe('AppTooltip', () => {
  it('renders tooltip text content and directional arrow', () => {
    const tree = renderTooltip();
    const text = tree.root.findByType(Text);
    const polygon = tree.root.findByType(Polygon);

    expect(text.props.children).toBe('Helpful tip');
    expect(polygon).toBeDefined();
  });

  it('renders nothing when visible is false', () => {
    const tree = renderTooltip({ visible: false });
    expect(tree.toJSON()).toBeNull();
  });

  it('applies directional flex layout styles', () => {
    const bottomTree = renderTooltip({ direction: 'bottom' });
    const bottomWrapper = bottomTree.root.findAllByType(View)[0];
    const bottomStyle = StyleSheet.flatten(bottomWrapper.props.style);
    expect(bottomStyle.flexDirection).toBe('column-reverse');

    const topTree = renderTooltip({ direction: 'top' });
    const topWrapper = topTree.root.findAllByType(View)[0];
    const topStyle = StyleSheet.flatten(topWrapper.props.style);
    expect(topStyle.flexDirection).toBe('column');
  });
});
