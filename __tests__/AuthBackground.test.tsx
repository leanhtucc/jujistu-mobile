import { AuthBackground } from '@jujistu/features/auth';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

describe('AuthBackground', () => {
  it('keeps children visible over a black fallback while the image loads', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <AuthBackground>
          <Text>Authentication content</Text>
        </AuthBackground>,
      );
    });

    const root = tree.root.findAllByType(View)[0];
    const content = tree.root.findByType(Text);

    expect(StyleSheet.flatten(root.props.style)).toMatchObject({
      backgroundColor: '#000000',
    });
    expect(content.props.children).toBe('Authentication content');
  });

  it('reports ready after both its first layout and background load', () => {
    const onReady = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(
        <AuthBackground onReady={onReady}>
          <Text>Authentication content</Text>
        </AuthBackground>,
      );
    });

    const root = tree.root.findAllByType(View)[0];
    const image = tree.root.findByType(Image);

    act(() => root.props.onLayout());
    expect(onReady).not.toHaveBeenCalled();

    act(() => image.props.onLoad());
    expect(onReady).toHaveBeenCalledTimes(1);
  });
});
