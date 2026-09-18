import { NavigationFallback } from '@jujistu/app/navigation/NavigationFallback';
import React from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
}));

describe('NavigationFallback', () => {
  beforeEach(() => {
    const animation = {
      reset: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    } as unknown as Animated.CompositeAnimation;
    jest.spyOn(Animated, 'timing').mockReturnValue(animation);
    jest.spyOn(Animated, 'loop').mockReturnValue(animation);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('reveals the complete loading scene atomically after local assets load', () => {
    const onReady = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(<NavigationFallback onReady={onReady} />);
    });

    const root = tree.root.findAllByType(View)[0];
    const images = tree.root.findAllByType(Image);
    const scene = tree.root
      .findAllByType(View)
      .find(view => StyleSheet.flatten(view.props.style)?.opacity === 0)!;

    expect(StyleSheet.flatten(root.props.style)).toMatchObject({
      backgroundColor: '#000000',
    });
    expect(StyleSheet.flatten(scene.props.style)).toMatchObject({ opacity: 0 });

    act(() => {
      root.props.onLayout();
      images.forEach(image => image.props.onLoad());
    });

    expect(StyleSheet.flatten(scene.props.style).opacity).toBeUndefined();
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(tree.toJSON())).toContain('Loading...');

    act(() => tree.unmount());
  });

  it('animates progress bar determinately from 0% to 100% when scene is ready', () => {
    const timingSpy = jest.spyOn(Animated, 'timing');
    const loopSpy = jest.spyOn(Animated, 'loop');

    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<NavigationFallback duration={4000} />);
    });

    // Before assets load, progress animation has not started
    expect(timingSpy).not.toHaveBeenCalled();

    const root = tree.root.findAllByType(View)[0];
    const images = tree.root.findAllByType(Image);

    // Assets load and layout triggers
    act(() => {
      root.props.onLayout();
      images.forEach(image => image.props.onLoad());
    });

    // Timing animation starts to value 1 over 4000ms, not looping
    expect(timingSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        duration: 4000,
        toValue: 1,
        useNativeDriver: true,
      }),
    );
    expect(loopSpy).not.toHaveBeenCalled();

    // Verify progressFill has 100% width
    const progressFills = tree.root
      .findAllByType(Animated.View)
      .filter(view => StyleSheet.flatten(view.props.style)?.width === '100%');
    expect(progressFills.length).toBe(1);

    act(() => tree.unmount());
  });
});
