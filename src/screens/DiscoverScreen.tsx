import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated as RNAnimated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PETS } from '../data/pets';
import { Pet } from '../types';
import { SwipeCard } from '../components/SwipeCard';
import { saveFavorite } from '../utils/storage';

const { width } = Dimensions.get('window');

export const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deck] = useState<Pet[]>([...PETS]);
  const heartAnim = useRef(new RNAnimated.Value(0)).current;

  const showHeartBurst = useCallback(() => {
    heartAnim.setValue(0);
    RNAnimated.sequence([
      RNAnimated.timing(heartAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      RNAnimated.timing(heartAnim, { toValue: 0, duration: 400, delay: 200, useNativeDriver: true }),
    ]).start();
  }, [heartAnim]);

  const handleSwipeRight = useCallback(async (pet: Pet) => {
    showHeartBurst();
    await saveFavorite(pet);
    setCurrentIndex(prev => prev + 1);
  }, [showHeartBurst]);

  const handleSwipeLeft = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const handleReset = () => {
    setCurrentIndex(0);
  };

  const remaining = deck.length - currentIndex;

  const heartScale = heartAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.5, 1] });
  const heartOpacity = heartAnim;

  const visibleCards = deck.slice(currentIndex, currentIndex + 3).reverse();

  if (remaining === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🐾</Text>
        <Text style={styles.emptyTitle}>No more pets nearby!</Text>
        <Text style={styles.emptySubtitle}>Check back soon for more adorable pets looking for a home.</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>🔄 Reload Deck</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🐾 PawSwipe</Text>
        <Text style={styles.counter}>{remaining} pets left</Text>
      </View>

      <View style={styles.cardArea}>
        {visibleCards.map((pet, i) => {
          const actualIndex = visibleCards.length - 1 - i;
          const isTop = actualIndex === 0;
          return (
            <SwipeCard
              key={pet.id}
              pet={pet}
              isTop={isTop}
              index={actualIndex}
              onSwipeRight={() => handleSwipeRight(pet)}
              onSwipeLeft={handleSwipeLeft}
              onPress={() => navigation.navigate('PetDetail', { pet })}
            />
          );
        })}
      </View>

      <RNAnimated.View
        style={[
          styles.heartBurst,
          { transform: [{ scale: heartScale }], opacity: heartOpacity },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.heartBurstText}>❤️</Text>
      </RNAnimated.View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.skipButton]}
          onPress={() => handleSwipeLeft()}
        >
          <Text style={styles.skipText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.favoriteButton]}
          onPress={() => handleSwipeRight(deck[currentIndex])}
        >
          <Text style={styles.heartText}>♥</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: '#2D3436', textAlign: 'center' },
  emptySubtitle: { fontSize: 16, color: '#636e72', marginTop: 8, textAlign: 'center', lineHeight: 22 },
  resetButton: {
    marginTop: 30,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
  },
  resetButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: { fontSize: 24, fontWeight: '800', color: '#FF6B6B' },
  counter: { fontSize: 14, color: '#636e72', fontWeight: '500' },
  cardArea: {
    flex: 1,
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBurst: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    zIndex: 999,
  },
  heartBurstText: { fontSize: 80 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 30,
    paddingTop: 10,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginHorizontal: 20,
  },
  skipButton: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#FF6B6B' },
  favoriteButton: { backgroundColor: '#FF6B6B' },
  skipText: { fontSize: 28, color: '#FF6B6B' },
  heartText: { fontSize: 28, color: '#fff' },
});
