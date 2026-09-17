import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { AppToast } from '@jujistu/ui';
import type { ToastProps } from '@jujistu/ui';
import { semanticColors } from '../src/shared/theme/semantic/colors';

function renderToast(props: Partial<ToastProps> = {}) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <AppToast message="Changes saved successfully" {...props} />,
    );
  });
  return tree;
}

describe('AppToast', () => {
  it('renders message, title and alert accessibility role', () => {
    const tree = renderToast({ title: 'Notice' });
    const alert = tree.root.findByProps({ accessibilityRole: 'alert' });
    const texts = tree.root.findAllByType(Text).map(t => t.props.children);

    expect(alert).toBeDefined();
    expect(texts).toContain('Notice');
    expect(texts).toContain('Changes saved successfully');
  });

  it('renders nothing when visible is false', () => {
    const tree = renderToast({ visible: false });
    expect(tree.toJSON()).toBeNull();
  });

  it('applies error status styling with approved error color', () => {
    const tree = renderToast({ status: 'error' });
    const container = tree.root.findAllByType(View)[0];
    const containerStyle = StyleSheet.flatten(container.props.style);

    expect(containerStyle.borderColor).toBe(semanticColors.border.error);
  });
});
