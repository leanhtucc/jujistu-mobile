import type { FeaturedVideo, VideoCategory } from '../types/video.types';

export const VIDEO_CATEGORIES: ReadonlyArray<{
  readonly key: VideoCategory;
  readonly label: string;
}> = [
  { key: 'all', label: 'Tất cả' },
  { key: 'news', label: 'Tin tức' },
  { key: 'faceoff', label: 'Faceoff' },
  { key: 'highlight', label: 'Highlight' },
  { key: 'full-fight', label: 'Full fight' },
];

export const FEATURED_VIDEOS: ReadonlyArray<FeaturedVideo> = [
  {
    id: 'tran-quoc-toan-zakhar-dzmitrychenka',
    category: 'faceoff',
    title: 'Trần Quốc Toản Vs Zakhar Dzmitrychenka',
    publishedAt: '5:30 PM November 13, 2025',
    durationLabel: '2:50',
    channelName: 'Jujitsu Championship',

    thumbnail: require('../../../../assets/image/videos/faceoff-rising-legends.png'),

    // Video MP4 kiểm thử tương thích ExoPlayer trên Android
    mediaUri:
      'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
  },

  {
    id: 'most-fiery-faceoffs-2021',
    category: 'faceoff',
    title: 'Most Fiery Faceoffs of 2021',
    publishedAt: '5:30 PM November 13, 2025',
    durationLabel: '2:50',
    channelName: 'Jujitsu Championship',

    thumbnail: require('../../../../assets/image/videos/faceoff-ufc-268.png'),

    mediaUri:
      'https://test-videos.co.uk/vids/tears-of-steel/mp4/h264/720/TearsOfSteel_720_10s_1MB.mp4',
  },

  {
    id: 'doi-dau-ruc-lua-2025',
    category: 'highlight',
    title: 'Đối đầu rực lửa 2025',
    publishedAt: '5:30 PM November 13, 2025',
    durationLabel: '2:50',
    channelName: 'Jujitsu Championship',

    thumbnail: require('../../../../assets/image/videos/faceoff-prague.png'),

    mediaUri:
      'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4',
  },

  {
    id: 'lion-championship-28',
    category: 'full-fight',
    title: 'Lion Championship 28',
    publishedAt: '5:30 PM November 13, 2025',
    durationLabel: '2:50',
    channelName: 'Jujitsu Championship',

    thumbnail: require('../../../../assets/image/videos/faceoff-rising-legends.png'),

    mediaUri:
      'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4',
  },
];

export function getFeaturedVideo(videoId: string): FeaturedVideo | undefined {
  return (
    FEATURED_VIDEOS.find(video => video.id === videoId) ?? FEATURED_VIDEOS[0]
  );
}

export function filterFeaturedVideos(
  category: VideoCategory,
  searchQuery: string,
): ReadonlyArray<FeaturedVideo> {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('vi');

  return FEATURED_VIDEOS.filter(video => {
    const matchesCategory = category === 'all' || video.category === category;

    const matchesQuery =
      normalizedQuery.length === 0 ||
      video.title.toLocaleLowerCase('vi').includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}
