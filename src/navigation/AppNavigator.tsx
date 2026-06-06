import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Satellite, Star, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../contexts/ThemeContext';
import {
  RootTabParamList,
  HomeStackParamList,
  EnvironmentsStackParamList,
} from '../types';

import { HomeScreen } from '../screens/HomeScreen';
import { EnvironmentsListScreen } from '../screens/EnvironmentsListScreen';
import { EnvironmentDetailScreen } from '../screens/EnvironmentDetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { NasaGalleryScreen } from '../screens/NasaGalleryScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const EnvStack = createNativeStackNavigator<EnvironmentsStackParamList>();

function HomeStackNavigator() {
  const { colors } = useTheme();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="EnvironmentDetail" component={EnvironmentDetailScreen} />
      <HomeStack.Screen name="NasaGallery" component={NasaGalleryScreen} />
    </HomeStack.Navigator>
  );
}

function EnvironmentsStackNavigator() {
  const { colors } = useTheme();
  return (
    <EnvStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <EnvStack.Screen name="EnvironmentsList" component={EnvironmentsListScreen} />
      <EnvStack.Screen name="EnvironmentDetail" component={EnvironmentDetailScreen} />
    </EnvStack.Navigator>
  );
}

export function AppNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom + 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: ({ focused, color }) => {
            const size = 22;
            if (route.name === 'Home') return <Home size={size} color={color} />;
            if (route.name === 'Environments') return <Satellite size={size} color={color} />;
            if (route.name === 'Favorites') return <Star size={size} color={color} fill={focused ? color : 'transparent'} />;
            if (route.name === 'Settings') return <Settings size={size} color={color} />;
            return null;
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{ tabBarLabel: 'Início' }}
        />
        <Tab.Screen
          name="Environments"
          component={EnvironmentsStackNavigator}
          options={{ tabBarLabel: 'Ambientes' }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ tabBarLabel: 'Favoritos' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarLabel: 'Config.' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
