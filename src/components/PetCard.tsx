import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Pet } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 1.3;

interface Props {
  pet: Pet;
  onPress?: () => void;
  style?: object;
}

export const PetCard: React.FC<Props> = ({ pet, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]} activeOpacity={0.95}>
      <Image source={{ uri: pet.imageUrl }} style={styles.image} />
      <View style={styles.gradient}>
        <View style={styles.info}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.details}>{pet.age} • {pet.breed}</Text>
          <View style={styles.row}>
            <Text style={styles.badge}>{pet.gender}</Text>
            {pet.traits.slice(0, 2).map(trait => (
              <Text key={trait} style={styles.trait}>{trait}</Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 20,
  },
  info: {},
  name: { color: '#fff', fontSize: 28, fontWeight: '700' },
  details: { color: '#ffffffcc', fontSize: 16, marginTop: 2 },
  row: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' },
  badge: {
    backgroundColor: '#FF6B6B',
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  trait: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
});
