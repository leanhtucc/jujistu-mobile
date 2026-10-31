import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AppBeltBar } from '@jujistu/ui';

describe('AppBeltBar', () => {
  it('renders brown belt with 2 degrees correctly', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <AppBeltBar belt="brown" degrees={2} height={12} />,
      );
    });

    const root = tree.root.findByProps({ testID: 'app-belt-bar' });
    expect(root).toBeDefined();
    expect(root.props.accessibilityLabel).toBe('Đai brown, 2 vạch');

    act(() => {
      tree.unmount();
    });
  });

  it('renders black belt with red sleeve and 4 degrees', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <AppBeltBar belt="black" degrees={4} height={14} />,
      );
    });

    const root = tree.root.findByProps({ testID: 'app-belt-bar' });
    expect(root.props.accessibilityLabel).toBe('Đai black, 4 vạch');

    act(() => {
      tree.unmount();
    });
  });
});
