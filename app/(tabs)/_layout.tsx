import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Icon from '@/assets/icons'
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: wp(2),
          fontWeight: 600,
        },
        tabBarStyle: {
          padding: wp(1),
          height: hp(7)
        }
      }}>
      <Tabs.Screen
        name="photos"
        options={{
          title: 'Photos',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={'image'} color={color} size={26} strokeWidth={1.6} />
          ),

        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={'library'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
