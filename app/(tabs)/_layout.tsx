import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#1D1D1F',
        tabBarInactiveTintColor: '#C7C7CC',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
      }}
    >
      {/* 1. Trang chủ */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Feather name="grid" size={22} color={color} />,
        }}
      />

      {/* 2. CHAT AI */}
      <Tabs.Screen
        name="chat" 
        options={{
          tabBarIcon: ({ color }) => <Feather name="message-circle" size={22} color={color} />,
        }}
      />

      {/* 3. YÊU THÍCH (Đã chuyển lên sau Chat) */}
      <Tabs.Screen
        name="Wishlist"
        options={{
          tabBarIcon: ({ color }) => <Feather name="heart" size={22} color={color} />,
        }}
      />

      {/* 4. TÌM KIẾM */}
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color }) => <Feather name="search" size={22} color={color} />,
        }}
      />

      {/* 5. GIỎ HÀNG */}
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color }) => <Feather name="shopping-bag" size={22} color={color} />,
        }}
      />

      {/* 6. HỒ SƠ */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}