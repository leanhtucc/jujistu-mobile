import type { ImageSourcePropType } from 'react-native';

export type VideoCategory =
  | 'all'
  | 'news'
  | 'faceoff'
  | 'highlight'
  | 'full-fight';

export interface FeaturedVideo {
  readonly id: string;
  readonly category: Exclude<VideoCategory, 'all'>;
  readonly title: string;
  readonly publishedAt: string;
  readonly durationLabel: string;
  readonly channelName: string;
  readonly thumbnail: ImageSourcePropType;
  readonly mediaUri: string;
}
