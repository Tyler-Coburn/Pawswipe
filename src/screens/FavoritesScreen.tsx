import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Pet } from '../types';
import { getFavorites, removeFavorite } from '../utils/storage';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 50) / 2;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<Pet[]>([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites);
    }, [])
  );

  const handleRemove = (pet: Pet) => {
    Alert.alert('Remove Favorite', `Remove ${pet.name} from favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await removeFavorite(pet.id);
          setFavorites(prev => prev.filter(f => f.id !== pet.id));
        },
      },
    ]);
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🐾</Text>
        <Text style={styles.emptyTitle}>No favorites yet!</Text>
        <Text style={styles.emptySubtitle}>Start swiping to find your perfect match 🐾</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Favorites ❤️</Text>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PetDetail', { pet: item })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.cardInfo}>
              <Text style={styles.petName}>{item.name}</Text>
              <Text style={styles.petBreed}>{item.breed}</Text>
              <Text style={styles.petAge}>{item.age}</Text>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item)}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
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
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3436',
    padding: 20,
    paddingBottom: 10,
  },
  list: { padding: 15 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: { width: '100%', height: ITEM_WIDTH * 1.1, resizeMode: 'cover' },
  cardInfo: { padding: 10 },
  petName: { fontSize: 16, fontWeight: '700', color: '#2D3436' },
  petBreed: { fontSize: 12, color: '#636e72', marginTop: 2 },
  petAge: { fontSize: 12, color: '#636e72', marginTop: 1 },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,107,107,0.85)',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
