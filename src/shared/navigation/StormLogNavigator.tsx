import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StormLogListScreen } from '../../features/storm-log/screens/StormLogListScreen';
import { StormLogDetailScreen } from '../../features/storm-log/screens/StormLogDetailScreen';
import type { StormLogStackParamList } from './types';

const Stack = createNativeStackNavigator<StormLogStackParamList>();

export function StormLogNavigator(){
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StormLogList" component={StormLogListScreen} />
      <Stack.Screen
        name="StormLogDetail"
        component={StormLogDetailScreen}
        options={{ headerShown: true, title: 'Storm Detail' }}
      />
    </Stack.Navigator>
  );
}
