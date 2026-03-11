import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Pet } from '../types';
import { PetCard } from './PetCard';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 1.3;

interface Props {
  pet: Pet;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onPress: () => void;
  isTop: boolean;
  index: number;
}

export const SwipeCard: React.FC<Props> = ({
  pet,
  onSwipeLeft,
  onSwipeRight,
  onPress,
  isTop,
  index,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const handleSwipeLeft = useCallback(() => {
    onSwipeLeft();
  }, [onSwipeLeft]);

  const handleSwipeRight = useCallback(() => {
    onSwipeRight();
  }, [onSwipeRight]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(width * 1.5, { duration: 300 }, () => {
          runOnJS(handleSwipeRight)();
        });
        translateY.value = withTiming(event.translationY, { duration: 300 });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-width * 1.5, { duration: 300 }, () => {
          runOnJS(handleSwipeLeft)();
        });
        translateY.value = withTiming(event.translationY, { duration: 300 });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-15, 0, 15],
      'clamp'
    );
    const scale = isTop
      ? 1
      : interpolate(index, [0, 1, 2], [1, 0.95, 0.9], 'clamp');
    const translateYOffset = isTop
      ? translateY.value
      : interpolate(index, [0, 1, 2], [0, -10, -20], 'clamp');

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateYOffset },
        { rotate: `${rotate}deg` },
        { scale },
      ],
    };
  });

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD / 2], [0, 1], 'clamp'),
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD / 2, 0], [1, 0], 'clamp'),
  }));

  if (!isTop) {
    return (
      <Animated.View style={[styles.container, cardStyle]}>
        <PetCard pet={pet} />
      </Animated.View>
    );
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, cardStyle]}>
        <PetCard pet={pet} onPress={onPress} />
        <Animated.View style={[styles.overlay, styles.likeOverlay, likeOpacity]}>
          <Text style={[styles.overlayText, styles.likeText]}>LIKE ❤️</Text>
        </Animated.View>
        <Animated.View style={[styles.overlay, styles.nopeOverlay, nopeOpacity]}>
          <Text style={[styles.overlayText, styles.nopeText]}>NOPE ✗</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  overlay: {
    position: 'absolute',
    top: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 3,
  },
  likeOverlay: {
    left: 20,
    borderColor: '#4CAF50',
    transform: [{ rotate: '-15deg' }],
  },
  nopeOverlay: {
    right: 20,
    borderColor: '#FF6B6B',
    transform: [{ rotate: '15deg' }],
  },
  overlayText: {
    fontSize: 24,
    fontWeight: '800',
  },
  likeText: {
    color: '#4CAF50',
  },
  nopeText: {
    color: '#FF6B6B',
  },
});
