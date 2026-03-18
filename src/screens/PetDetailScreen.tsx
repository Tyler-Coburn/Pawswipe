import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Pet } from '../types';
import { isFavorite, saveFavorite, removeFavorite } from '../utils/storage';

const { width } = Dimensions.get('window');

export const PetDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { pet }: { pet: Pet } = route.params;
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    isFavorite(pet.id).then(setFavorited);
  }, [pet.id]);

  const toggleFavorite = async () => {
    if (favorited) {
      await removeFavorite(pet.id);
    } else {
      await saveFavorite(pet);
    }
    setFavorited(!favorited);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: pet.imageUrl }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <Text style={styles.favoriteButtonText}>{favorited ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{pet.name}</Text>
            <View style={styles.genderBadge}>
              <Text style={styles.genderText}>{pet.gender === 'Male' ? '♂' : '♀'} {pet.gender}</Text>
            </View>
          </View>

          <Text style={styles.breed}>{pet.breed} • {pet.age}</Text>

          <View style={styles.traitsContainer}>
            {pet.traits.map(trait => (
              <View key={trait} style={styles.traitChip}>
                <Text style={styles.traitText}>{trait}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>About {pet.name}</Text>
          <Text style={styles.description}>{pet.description}</Text>

          <Text style={styles.sectionTitle}>Compatibility</Text>
          <View style={styles.compatRow}>
            <View style={[styles.compatBadge, pet.goodWithKids ? styles.compatYes : styles.compatNo]}>
              <Text style={styles.compatText}>{pet.goodWithKids ? '✓' : '✗'} Kids</Text>
            </View>
            <View style={[styles.compatBadge, pet.goodWithDogs ? styles.compatYes : styles.compatNo]}>
              <Text style={styles.compatText}>{pet.goodWithDogs ? '✓' : '✗'} Dogs</Text>
            </View>
            <View style={[styles.compatBadge, pet.goodWithCats ? styles.compatYes : styles.compatNo]}>
              <Text style={styles.compatText}>{pet.goodWithCats ? '✓' : '✗'} Cats</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Shelter</Text>
          <View style={styles.shelterCard}>
            <Text style={styles.shelterName}>🏠 {pet.shelterName}</Text>
            <Text style={styles.shelterLocation}>📍 {pet.shelterLocation}</Text>
          </View>

          <TouchableOpacity
            style={styles.adoptButton}
            onPress={() => Linking.openURL(pet.adoptionUrl)}
          >
            <Text style={styles.adoptButtonText}>🐾 Start Adoption Process</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  imageContainer: { position: 'relative' },
  image: { width, height: width * 1.1, resizeMode: 'cover' },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: { fontSize: 22, color: '#2D3436' },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonText: { fontSize: 20 },
  content: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 30, fontWeight: '800', color: '#2D3436' },
  genderBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  genderText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  breed: { fontSize: 16, color: '#636e72', marginTop: 4 },
  traitsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 },
  traitChip: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  traitText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2D3436', marginTop: 20, marginBottom: 8 },
  description: { fontSize: 15, color: '#636e72', lineHeight: 22 },
  compatRow: { flexDirection: 'row' },
  compatBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  compatYes: { backgroundColor: '#d4edda' },
  compatNo: { backgroundColor: '#f8d7da' },
  compatText: { fontSize: 14, fontWeight: '600', color: '#2D3436' },
  shelterCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  shelterName: { fontSize: 16, fontWeight: '700', color: '#2D3436' },
  shelterLocation: { fontSize: 14, color: '#636e72', marginTop: 4 },
  adoptButton: {
    marginTop: 24,
    marginBottom: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  adoptButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
