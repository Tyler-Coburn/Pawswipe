import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { PetDetailScreen } from '../screens/PetDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverMain" component={DiscoverScreen} />
      <Stack.Screen name="PetDetail" component={PetDetailScreen} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
      <Stack.Screen name="PetDetail" component={PetDetailScreen} />
    </Stack.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF6B6B',
          tabBarInactiveTintColor: '#b2bec3',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#f0f0f0',
            borderTopWidth: 1,
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: { fontWeight: '600', fontSize: 12 },
        }}
      >
        <Tab.Screen
          name="Discover"
          component={DiscoverStack}
          options={{
            tabBarLabel: 'Discover',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🐾</Text>,
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesStack}
          options={{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>❤️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
