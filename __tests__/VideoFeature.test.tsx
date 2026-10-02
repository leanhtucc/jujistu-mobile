import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { VideoLibraryScreen, VideoPlayerScreen } from '../src/features/videos';
import { filterFeaturedVideos } from '../src/features/videos/data/video-content';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

function renderWithSafeArea(element: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        {element}
      </SafeAreaProvider>,
    );
  });
  return tree;
}

describe('Video feature', () => {
  it('filters videos by category and normalized title query', () => {
    expect(filterFeaturedVideos('faceoff', '')).toHaveLength(2);
    expect(filterFeaturedVideos('all', 'fiery')).toHaveLength(1);
    expect(filterFeaturedVideos('news', '')).toHaveLength(0);
  });

  it('renders the independent video library with the Home section title', () => {
    const tree = renderWithSafeArea(
      <VideoLibraryScreen onBack={jest.fn()} onSelectVideo={jest.fn()} />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map(node => node.props.children);

    expect(texts).toContain('Video nổi bật');
    expect(texts).not.toContain('Tin tức & Sự kiện');
    expect(texts).toContain('Trần Quốc Toản Vs Zakhar Dzmitrychenka');

    act(() => tree.unmount());
  });

  it('opens search mode and filters compact results', () => {
    const tree = renderWithSafeArea(
      <VideoLibraryScreen onBack={jest.fn()} onSelectVideo={jest.fn()} />,
    );
    const searchButton = tree.root.findByProps({
      accessibilityLabel: 'Tìm video',
    });

    act(() => searchButton.props.onPress());

    const input = tree.root.findByType(TextInput);
    act(() => input.props.onChangeText('Fiery'));

    const texts = tree.root
      .findAllByType(Text)
      .map(node => node.props.children);
    expect(texts).toContain('Most Fiery Faceoffs of 2021');
    expect(texts).not.toContain('Trần Quốc Toản Vs Zakhar Dzmitrychenka');

    act(() => tree.unmount());
  });

  it('surfaces playback errors and offers a retry without exposing the URL', () => {
    const tree = renderWithSafeArea(
      <VideoPlayerScreen
        onBack={jest.fn()}
        videoId="tran-quoc-toan-zakhar-dzmitrychenka"
      />,
    );
    const nativeVideo = tree.root.findByProps({ testID: 'native-video' });

    act(() => nativeVideo.props.onError({ error: { errorCode: 'network' } }));

    const texts = tree.root
      .findAllByType(Text)
      .map(node => node.props.children);
    expect(texts).toContain('Không thể phát video. Vui lòng thử lại.');
    expect(JSON.stringify(texts)).not.toContain('storage.googleapis.com');

    act(() => tree.unmount());
  });
});
