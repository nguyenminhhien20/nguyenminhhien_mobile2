import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WishlistScreen() {
  return (
    <View style={styles.container}>
      {/* Header tối giản */}
      <View style={styles.header}>
        <Text style={styles.title}>Yêu thích</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyContainer}>
          {/* Icon trái tim rỗng bản mảnh, màu xám trắng cực sang */}
          <View style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={70} color="#333" />
          </View>
          
          <Text style={styles.emptyTitle}>Danh sách đang trống</Text>
          <Text style={styles.emptySubText}>
            Lưu lại những món đồ bạn ưng ý nhất để không bỏ lỡ chúng sau này.
          </Text>

          {/* Nút màu Trắng, chữ Đen - Đồng bộ với nút Edit Profile của bạn */}
          <TouchableOpacity activeOpacity={0.8} style={styles.shopBtn}>
            <Text style={styles.shopBtnText}>Khám phá ngay</Text>
          </TouchableOpacity>
        </View>

        {/* Khoảng trống để không bị Tab Bar trắng che */}
        <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' // Đen tuyệt đối đồng bộ với Profile/Home
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: -1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 45,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#151515', // Viền xám tối cực mờ
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptySubText: {
    color: '#555', // Màu xám trầm
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 40,
  },
  shopBtn: {
    backgroundColor: '#FFF', // Nút trắng hoàn toàn
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  shopBtnText: {
    color: '#000', // Chữ đen
    fontWeight: '700',
    fontSize: 15,
    textTransform: 'uppercase', // Chữ in hoa cho chuyên nghiệp
  },
});