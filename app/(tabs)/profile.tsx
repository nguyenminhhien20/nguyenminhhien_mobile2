import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur'; // npx expo install expo-blur

const { width, height } = Dimensions.get('window');

export default function ArtisticProfile() {
  const router = useRouter();

  const menuGroups = [
    {
      label: "QUẢN LÝ",
      items: [
        { icon: 'shopping-bag', label: 'Lịch sử mua hàng', desc: '12 đơn hàng đang giao', color: '#6366f1' },
        { icon: 'map-pin', label: 'Sổ địa chỉ', desc: '3 địa chỉ đã lưu', color: '#06b6d4' },
      ]
    },
    {
      label: "TIỆN ÍCH",
      items: [
        { icon: 'gift', label: 'Kho Voucher', desc: 'Có 5 mã sắp hết hạn', color: '#ec4899' },
        { icon: 'shield', label: 'Bảo mật', desc: 'Xác thực 2 lớp: Bật', color: '#10b981' },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* CÁC KHỐI MÀU NGHỆ THUẬT CHẠY NGẦM DƯỚI NỀN */}
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />
      <View style={styles.bgBlob3} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* PROFILE HEADER - FLOATING GLASS */}
        <View style={styles.glassHeader}>
          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)']}
            style={styles.headerGradient}
          >
            <View style={styles.profileRow}>
              <View style={styles.avatarWrapper}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000' }} 
                  style={styles.avatar} 
                />
                <LinearGradient colors={['#6366f1', '#a855f7']} style={styles.onlineStatus} />
              </View>
              
              <View style={styles.infoText}>
                <Text style={styles.userName}>Alex Meiapp</Text>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>PLATINUM TIER</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.settingsIcon}>
                <Ionicons name="settings-sharp" size={22} color="#1e293b" />
              </TouchableOpacity>
            </View>

            {/* QUICK STATS - HORIZONTAL GLASS */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statVal}>2.5k</Text>
                <Text style={styles.statLab}>Point</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statVal}>08</Text>
                <Text style={styles.statLab}>Voucher</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statVal}>120</Text>
                <Text style={styles.statLab}>Follow</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* MENU GROUPS */}
        {menuGroups.map((group, gIdx) => (
          <View key={gIdx} style={styles.groupSection}>
            <Text style={styles.groupLabel}>{group.label}</Text>
            {group.items.map((item, iIdx) => (
              <TouchableOpacity key={iIdx} style={styles.menuCard}>
                <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                  <Feather name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.menuTextContent}>
                  <Text style={styles.menuTitle}>{item.label}</Text>
                  <Text style={styles.menuDesc}>{item.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* ĐĂNG XUẤT - MINIMAL STYLE */}
        <TouchableOpacity 
            style={styles.logoutBtn}
            onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
          <Feather name="log-out" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  // Nền nghệ thuật (Blobs)
  bgBlob1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: '#e0e7ff', top: -50, right: -100, opacity: 0.6 },
  bgBlob2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#fae8ff', top: height * 0.4, left: -50, opacity: 0.5 },
  bgBlob3: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: '#ccfbf1', bottom: 50, right: -50, opacity: 0.4 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 60 },

  // Header Kính (Glass)
  glassHeader: {
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    marginBottom: 30,
    ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20 },
        android: { elevation: 4 }
    })
  },
  headerGradient: { padding: 25 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 70, height: 70, borderRadius: 25 },
  onlineStatus: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: '#fff' },
  infoText: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 22, fontWeight: '900', color: '#1e293b' },
  rankBadge: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#000', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 6, 
    marginTop: 5 
  },
  rankText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  settingsIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },

  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 25, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 20, padding: 15 },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '900', color: '#1e293b' },
  statLab: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  statDivider: { width: 1, height: 20, backgroundColor: 'rgba(0,0,0,0.05)' },

  // Menu List
  groupSection: { marginBottom: 25 },
  groupLabel: { fontSize: 12, fontWeight: '900', color: '#cbd5e1', letterSpacing: 2, marginBottom: 15, marginLeft: 5 },
  menuCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 22, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  menuTextContent: { flex: 1, marginLeft: 15 },
  menuTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  menuDesc: { fontSize: 12, color: '#94a3b8', marginTop: 2 },

  // Logout
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20, 
    gap: 10,
    marginTop: 10 
  },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#94a3b8' }
});