import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import { WeatherScreen } from '../../features/weather/screens/WeatherScreen';
import { StormCaptureScreen } from '../../features/storm-capture/screens/StormCaptureScreen';
import { StormLogNavigator } from './StormLogNavigator';
import { useThemeColors } from '../theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const scheme = useColorScheme();
  const colors = useThemeColors();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
          tabBarIcon: () => null,
        }}
      >
        <Tab.Screen name="Weather" component={WeatherScreen} />
        <Tab.Screen name="Capture" component={StormCaptureScreen} />
        <Tab.Screen name="Log" component={StormLogNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
