import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000', // Icon hoạt động màu đen sâu
        tabBarInactiveTintColor: '#94a3b8', // Icon không hoạt động màu xám nhạt
        tabBarStyle: {
          position: 'absolute',
          bottom: 0, // Dính sát đáy màn hình
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9', // Đường kẻ cực mảnh tạo sự tách biệt
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen name="index" options={{
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
        )
      }} />
      
      <Tabs.Screen name="cart" options={{
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? "bag-handle" : "bag-handle-outline"} size={24} color={color} />
        )
      }} />

      {/* NÚT GIỮA: MÀU ĐEN NỔI BẬT TRÊN NỀN TRẮNG */}
      <Tabs.Screen 
        name="explore" 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButtonWrapper}>
              <View style={styles.centerButton}>
                <Ionicons name="grid" size={22} color="#fff" />
                <View style={styles.plusBadge}>
                   <Ionicons name="add" size={10} color="#fff" />
                </View>
              </View>
            </View>
          )
        }} 
      />

      <Tabs.Screen name="Wishlist" options={{
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
        )
      }} />

      <Tabs.Screen name="profile" options={{
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
        )
      }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 70,
    // Đảm bảo không bị lệch trục dọc
    marginTop: Platform.OS === 'ios' ? -5 : 0, 
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 16, // Bo góc Squircle hiện đại
    backgroundColor: '#000', // Nút đen tuyền sang trọng
    justifyContent: 'center',
    alignItems: 'center',
    // Đổ bóng nhẹ nhàng cho màu sáng
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#3b82f6', // Một điểm nhấn màu xanh nhỏ cho nút thêm
    borderRadius: 5,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000'
  }
});