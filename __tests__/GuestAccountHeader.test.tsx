import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AppButton } from '@jujistu/ui';
import { GuestAccountHeader } from '../src/features/home/components/GuestAccountHeader';

describe('GuestAccountHeader', () => {
  it('renders the logo with correct size and attributes', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<GuestAccountHeader />);
    });

    const images = tree.root.findAllByType(Image);
    expect(images.length).toBe(1);

    const logo = images[0];
    const style = StyleSheet.flatten(logo.props.style);
    expect(style.width).toBe(48);
    expect(style.height).toBe(48);
    expect(logo.props.accessibilityLabel).toBe('Jujitsu Championship Logo');
  });

  it('renders the welcome title and description', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<GuestAccountHeader />);
    });

    const texts = tree.root.findAllByType(Text);
    const textValues = texts.map(t => t.props.children);

    expect(textValues).toContain('Chào mừng đến với VIMMA!');
    expect(textValues).toContain(
      'Đăng nhập ngay để nhận thông tin mới nhất về giải đấu!',
    );

    const title = texts.find(
      t => t.props.children === 'Chào mừng đến với VIMMA!',
    );
    expect(title?.props.numberOfLines).toBe(1);
    expect(title?.props.ellipsizeMode).toBe('tail');
  });

  it('renders the login button with primary variant and sm size', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<GuestAccountHeader />);
    });

    const button = tree.root.findByType(AppButton);
    expect(button.props.label).toBe('Đăng nhập');
    expect(button.props.variant).toBe('primary');
    expect(button.props.size).toBe('sm');
  });

  it('fires onLogin callback when login button is pressed', () => {
    const handleLogin = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(
        <GuestAccountHeader onLogin={handleLogin} />,
      );
    });

    const button = tree.root.findByType(AppButton);
    act(() => {
      button.props.onPress();
    });

    expect(handleLogin).toHaveBeenCalledTimes(1);
  });

  it('preserves the 64px header container dimensions and background', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<GuestAccountHeader />);
    });

    const root = tree.root.findAllByType(View)[0];
    const rootStyle = StyleSheet.flatten(root.props.style);

    expect(rootStyle).toMatchObject({
      width: '100%',
      height: 64,
      paddingHorizontal: 16,
      backgroundColor: '#030003',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    });
  });

  it('renders larger typography on tablet viewports', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    act(() => {
      tree = ReactTestRenderer.create(<GuestAccountHeader />);
    });

    const texts = tree.root.findAllByType(Text);
    const title = texts.find(
      t => t.props.children === 'Chào mừng đến với VIMMA!',
    );
    const description = texts.find(
      t =>
        t.props.children ===
        'Đăng nhập ngay để nhận thông tin mới nhất về giải đấu!',
    );

    const titleStyle = StyleSheet.flatten(title?.props.style);
    const descStyle = StyleSheet.flatten(description?.props.style);

    expect(titleStyle.fontSize).toBe(20);
    expect(titleStyle.lineHeight).toBe(25);
    expect(descStyle.fontSize).toBe(14.5);
    expect(descStyle.lineHeight).toBe(19);
  });
});
