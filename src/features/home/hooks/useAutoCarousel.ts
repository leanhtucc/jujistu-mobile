import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
} from 'react-native';

interface AutoCarouselOptions {
  readonly itemCount: number;
  readonly itemStride: number;
  readonly intervalMs: number;
  readonly initialIndex?: number;
}

export function useAutoCarousel({
  itemCount,
  itemStride,
  intervalMs,
  initialIndex = 0,
}: AutoCarouselOptions) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const directionRef = useRef<1 | -1>(1);
  const safeInitialIndex = Math.max(0, Math.min(itemCount - 1, initialIndex));
  const [activeIndex, setActiveIndex] = useState(safeInitialIndex);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (itemCount < 2 || isInteracting) {
      return undefined;
    }

    const timer = setTimeout(() => {
      let nextIndex = activeIndex + directionRef.current;

      if (nextIndex >= itemCount) {
        directionRef.current = -1;
        nextIndex = activeIndex - 1;
      } else if (nextIndex < 0) {
        directionRef.current = 1;
        nextIndex = activeIndex + 1;
      }

      scrollRef.current?.scrollTo?.({
        animated: true,
        x: nextIndex * itemStride,
        y: 0,
      });
      setActiveIndex(nextIndex);
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [activeIndex, intervalMs, isInteracting, itemCount, itemStride]);

  const handleScrollBeginDrag = useCallback(() => {
    setIsInteracting(true);
  }, []);

  const handleScrollEndDrag = useCallback(() => {
    setIsInteracting(false);
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.max(
        0,
        Math.min(
          itemCount - 1,
          Math.round(event.nativeEvent.contentOffset.x / itemStride),
        ),
      );
      if (nextIndex === 0) {
        directionRef.current = 1;
      } else if (nextIndex === itemCount - 1) {
        directionRef.current = -1;
      }
      setActiveIndex(nextIndex);
      setIsInteracting(false);
    },
    [itemCount, itemStride],
  );

  return {
    activeIndex,
    handleMomentumScrollEnd,
    handleScrollBeginDrag,
    handleScrollEndDrag,
    scrollRef,
  } as const;
}
