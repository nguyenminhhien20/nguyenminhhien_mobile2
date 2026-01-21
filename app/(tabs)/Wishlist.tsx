import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      {/* Header gọn gàng */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Về chúng tôi</Text>
        <Text style={styles.headerTitle}>MSTORE</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Phần Quote thương hiệu - Làm nổi bật ý nghĩa */}
        <View style={styles.quoteSection}>
          <View style={styles.line} />
          <Text style={styles.quoteText}>
            "Chúng tôi tin rằng công nghệ tốt nhất là công nghệ đơn giản nhất để sử dụng nhưng mạnh mẽ nhất để sáng tạo."
          </Text>
          <View style={styles.line} />
        </View>

        {/* Các cột thông tin trải nghiệm */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Feather name="award" size={28} color="#1D1D1F" />
            <Text style={styles.infoTitle}>Tuyển chọn</Text>
            <Text style={styles.infoDesc}>Mỗi sản phẩm đều qua quy trình kiểm định 12 bước nghiêm ngặt.</Text>
          </View>

          <View style={styles.infoBox}>
            <Feather name="refresh-cw" size={28} color="#1D1D1F" />
            <Text style={styles.infoTitle}>Bảo hành</Text>
            <Text style={styles.infoDesc}>Chế độ 1 đổi 1 trong 30 ngày nếu có lỗi từ nhà sản xuất.</Text>
          </View>

          <View style={styles.infoBox}>
            <Feather name="headphones" size={28} color="#1D1D1F" />
            <Text style={styles.infoTitle}>Đồng hành</Text>
            <Text style={styles.infoDesc}>Đội ngũ kỹ thuật hỗ trợ trọn đời sản phẩm, bất kể nơi đâu.</Text>
          </View>
        </View>

        {/* Nút liên hệ và bản đồ */}
        <View style={styles.locationCard}>
          <Ionicons name="location-sharp" size={24} color="#1D1D1F" />
          <View style={styles.locationTextContent}>
            <Text style={styles.locationLabel}>Showroom Trải nghiệm</Text>
            <Text style={styles.locationDetail}>92b đường 339, Phước Long B, TP. Thủ Đức</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.7} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Liên hệ tư vấn viên</Text>
          <Feather name="arrow-right" size={18} color="#FFF" />
        </TouchableOpacity>

        {/* Footer nhỏ */}
        <Text style={styles.versionText}>MEI App Version 1.0.2 • Designed in Vietnam</Text>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' // Trắng tinh khiết
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 30,
    backgroundColor: '#FFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1D1D1F',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  quoteSection: {
    marginBottom: 50,
  },
  line: {
    width: 40,
    height: 2,
    backgroundColor: '#1D1D1F',
    marginVertical: 20,
  },
  quoteText: {
    fontSize: 20,
    color: '#1D1D1F',
    lineHeight: 30,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  infoGrid: {
    marginBottom: 20,
  },
  infoBox: {
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    marginTop: 15,
    marginBottom: 8,
  },
  infoDesc: {
    fontSize: 15,
    color: '#48484A',
    lineHeight: 22,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  locationTextContent: {
    marginLeft: 15,
  },
  locationLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
  },
  locationDetail: {
    fontSize: 14,
    color: '#1D1D1F',
    fontWeight: '500',
    marginTop: 2,
  },
  primaryBtn: {
    backgroundColor: '#1D1D1F',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    color: '#C7C7CC',
    fontSize: 12,
    marginTop: 40,
  }
});