import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { WelcomeScreen } from '@jujistu/features/auth';
import { AppButton } from '@jujistu/ui';
import { resolveAppButtonVisualRecipe } from '../src/ui/atoms/button-theme';

describe('WelcomeScreen', () => {
  it('renders the welcome hero and login button', () => {
    const onLogin = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(<WelcomeScreen onLogin={onLogin} />);
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Jujitsu Championship');
    expect(json).toContain('Đăng Nhập');

    const button = tree.root.findByType(AppButton);
    expect(button.props.label).toBe('Đăng Nhập');
    expect(button.props.size).toBe('md');
    expect(button.props.labelStyle).toBeUndefined();

    const recipe = resolveAppButtonVisualRecipe('primary', false);
    expect(recipe.backgroundColor).toBe('transparent');
    expect(recipe.gradient).toEqual({
      left: '#A70100',
      right: '#FE8B33',
    });
  });

  it('triggers onLogin when the login button is pressed', () => {
    const onLogin = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(<WelcomeScreen onLogin={onLogin} />);
    });

    const button = tree.root.findByType(AppButton);
    act(() => {
      button.props.onPress();
    });

    expect(onLogin).toHaveBeenCalledTimes(1);
  });
});
