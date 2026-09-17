import React from 'react';
import { ScrollView, Text } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';

import { AppTab, AppTabList } from '@jujistu/ui';
import type { TabListProps } from '@jujistu/ui';

const mockTabs = [
  { key: 'tab1', label: 'Tab One' },
  { key: 'tab2', label: 'Tab Two' },
  { key: 'tab3', label: 'Tab Three' },
];

function renderTabList(props: Partial<TabListProps> = {}) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <AppTabList
        activeKey="tab1"
        items={mockTabs}
        onTabPress={jest.fn()}
        {...props}
      />,
    );
  });
  return tree;
}

describe('AppTabList', () => {
  it('renders all tab items and sets active key as selected', () => {
    const tree = renderTabList({ activeKey: 'tab2' });
    const tabs = tree.root.findAllByType(AppTab);

    expect(tabs).toHaveLength(3);
    expect(tabs[0].props.selected).toBe(false);
    expect(tabs[1].props.selected).toBe(true);
    expect(tabs[2].props.selected).toBe(false);

    const labels = tree.root.findAllByType(Text).map(t => t.props.children);
    expect(labels).toEqual(['Tab One', 'Tab Two', 'Tab Three']);
  });

  it('triggers onTabPress with the clicked tab key', () => {
    const onTabPress = jest.fn();
    const tree = renderTabList({ onTabPress });
    const tabs = tree.root.findAllByType(AppTab);

    act(() => tabs[2].props.onPress());
    expect(onTabPress).toHaveBeenCalledWith('tab3');
  });

  it('renders a ScrollView when scrollable is true', () => {
    const defaultTree = renderTabList({ scrollable: false });
    expect(defaultTree.root.findAllByType(ScrollView)).toHaveLength(0);

    const scrollableTree = renderTabList({ scrollable: true });
    expect(scrollableTree.root.findAllByType(ScrollView)).toHaveLength(1);
  });
});
