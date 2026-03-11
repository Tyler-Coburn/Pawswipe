import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types';

const FAVORITES_KEY = '@pawswipe_favorites';

export const getFavorites = async (): Promise<Pet[]> => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('[PawSwipe] getFavorites error:', e);
    return [];
  }
};

export const saveFavorite = async (pet: Pet): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const exists = favorites.find(f => f.id === pet.id);
    if (!exists) {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, pet]));
    }
  } catch (e) {
    console.error('[PawSwipe] saveFavorite error:', e);
  }
};

export const removeFavorite = async (petId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter(f => f.id !== petId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('[PawSwipe] removeFavorite error:', e);
  }
};

export const isFavorite = async (petId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(f => f.id === petId);
  } catch (e) {
    console.error('[PawSwipe] isFavorite error:', e);
    return false;
  }
};
