import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  { id: '1', title: 'Bảo mật', icon: '🔒', bgColor: '#E0E7FF' },
  { id: '2', title: 'Nhanh', icon: '⚡', bgColor: '#FEF3C7' },
  { id: '3', title: 'Hỗ trợ', icon: '💬', bgColor: '#DCFCE7' },
  { id: '4', title: 'Tính năng', icon: '⭐', bgColor: '#FEE2E2' },
];

const HIGHLIGHTS = [
  { id: '1', title: 'Tính năng nổi bật 1', image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?auto=format&fit=crop&w=800&q=80' },
  { id: '2', title: 'Tính năng nổi bật 2', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80' },
  { id: '3', title: 'Tính năng nổi bật 3', image: 'https://images.unsplash.com/photo-1557683450-7e4d3f11e05b?auto=format&fit=crop&w=800&q=80' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleUserPress = () => setMenuVisible(!menuVisible);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleUserPress}>
          <Ionicons name="person-circle-outline" size={36} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* USER MENU */}
      {menuVisible && (
        <View style={styles.userMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push("/login"); }}>
            <Text style={styles.menuText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push("/register"); }}>
            <Text style={styles.menuText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        {/* HERO */}
        <View style={styles.hero}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Trải nghiệm tuyệt vời</Text>
            <Text style={styles.heroSubtitle}>Nhanh, an toàn và tiện lợi</Text>
            <TouchableOpacity style={styles.ctaButton} onPress={() => router.push("/register")}>
              <Text style={styles.ctaText}>Bắt đầu ngay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORY SECTION */}
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <View style={styles.categories}>
          {CATEGORIES.map(cat => (
            <View key={cat.id} style={[styles.categoryCard, { backgroundColor: cat.bgColor }]}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
            </View>
          ))}
        </View>

        {/* HIGHLIGHTS SECTION */}
        <Text style={styles.sectionTitle}>Điểm nổi bật</Text>
        <FlatList
          horizontal
          data={HIGHLIGHTS}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.highlightCard}>
              <Image source={{ uri: item.image }} style={styles.highlightImage} />
              <Text style={styles.highlightTitle}>{item.title}</Text>
            </View>
          )}
        />

        {/* BOTTOM CTA */}
        <TouchableOpacity style={styles.bottomButton} onPress={() => router.push("/register")}>
          <Text style={styles.bottomButtonText}>Tham gia ngay</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  userMenu: {
    position: 'absolute',
    top: 90,
    right: 20,
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 20,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
  menuText: { fontSize: 16, color: '#1f2937' },
  content: { paddingBottom: 40 },
  hero: { position: 'relative', width: '100%', height: 300, marginBottom: 30 },
  heroImage: { width: '100%', height: '100%', borderRadius: 20 },
  heroOverlay: { position: 'absolute', bottom: 20, left: 20 },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 6 },
  heroSubtitle: { color: '#fff', fontSize: 16, marginBottom: 10 },
  ctaButton: { backgroundColor: '#4f46e5', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginLeft: 20, marginBottom: 12 },
  categories: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30, flexWrap: 'wrap' },
  categoryCard: { width: '45%', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  categoryIcon: { fontSize: 28, marginBottom: 8 },
  categoryTitle: { fontWeight: '700', fontSize: 16, textAlign: 'center' },
  highlightCard: { marginRight: 12, width: 200, borderRadius: 16, overflow: 'hidden' },
  highlightImage: { width: '100%', height: 120 },
  highlightTitle: { padding: 8, fontWeight: '600', fontSize: 14, color: '#1f2937' },
  bottomButton: { backgroundColor: '#4f46e5', marginHorizontal: 20, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 30 },
  bottomButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
