import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image, 
  TouchableOpacity, Dimensions, SafeAreaView, StatusBar, TextInput,
  ImageBackground
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 1, name: 'iPhone', icon: 'logo-apple', color: '#000' },
  { id: 2, name: 'Samsung', icon: 'smartphone', iconType: 'Feather', color: '#1428a0' },
  { id: 3, name: 'Laptop', icon: 'laptop-outline', color: '#ffb703' },
  { id: 4, name: 'Watch', icon: 'watch-outline', color: '#e63946' },
  { id: 5, name: 'Audio', icon: 'headset-outline', color: '#8338ec' },
];

export default function PremiumStore() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- TOP BAR --- */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.locationLabel}>Giao tới</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>Quận 1, TP. Hồ Chí Minh</Text>
            <Feather name="chevron-down" size={14} color="#00B4D8" />
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="bell" size={20} />
            <View style={styles.dotBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="shopping-cart" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        
        {/* --- SEARCH & WELCOME --- */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Tìm kiếm mẫu{'\n'}<Text style={styles.boldText}>Công nghệ mới nhất</Text></Text>
        </View>

        {/* --- SEARCH BAR (Sticky candidate) --- */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInner}>
            <Ionicons name="search-outline" size={20} color="#ADB5BD" />
            <TextInput placeholder="Bạn đang tìm iPhone 15..." style={styles.input} />
            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons name="options-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- PROMO BANNER --- */}
        <View style={styles.promoSection}>
          <LinearGradient colors={['#00B4D8', '#0077B6']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.promoCard}>
            <View style={styles.promoContent}>
              <View style={styles.promoBadge}><Text style={styles.promoBadgeText}>Limited Offer</Text></View>
              <Text style={styles.promoTitle}>Giảm tới 30%</Text>
              <Text style={styles.promoSub}>Cho các dòng MacBook Pro M3</Text>
              <TouchableOpacity style={styles.promoBtn}><Text style={styles.promoBtnText}>Mua ngay</Text></TouchableOpacity>
            </View>
            <Image 
              source={{ uri: 'https://pngimg.com/uploads/macbook/macbook_PNG65.png' }} 
              style={styles.promoImage} 
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        {/* --- QUICK CATEGORIES --- */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.catItem}>
              <View style={[styles.catIconBox, {backgroundColor: cat.color + '10'}]}>
                {cat.iconType === 'Feather' ? 
                  <Feather name={cat.icon as any} size={22} color={cat.color} /> :
                  <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                }
              </View>
              <Text style={styles.catName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- FLASH SALE SECTION --- */}
        <View style={styles.sectionHeader}>
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>Flash Sale</Text>
            <View style={styles.timerBox}>
              <Text style={styles.timerText}>02:14:55</Text>
            </View>
          </View>
          <TouchableOpacity><Text style={styles.seeAll}>Xem tất cả</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingLeft: 20}}>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} style={styles.flashCard}>
              <Image source={{uri: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg'}} style={styles.flashImg} />
              <View style={styles.discountBadge}><Text style={styles.discountText}>-15%</Text></View>
              <Text style={styles.flashPrice}>28.990.000đ</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, {width: '70%'}]} />
                <Text style={styles.progressText}>Đã bán 45</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- TAB SELECTION --- */}
        <View style={styles.tabWrapper}>
          {['Tất cả', 'Phổ biến', 'Giá tốt'].map((t) => (
            <TouchableOpacity key={t} onPress={() => setActiveTab(t)} style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}>
              <Text style={[styles.tabLabel, activeTab === t && styles.tabLabelActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- PRODUCT LIST (Vertical) --- */}
        <View style={styles.verticalGrid}>
          {[1, 2, 4, 5].map((i) => (
            <View key={i} style={styles.productRowCard}>
               <Image source={{uri: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=1000'}} style={styles.rowImg} />
               <View style={styles.rowContent}>
                  <Text style={styles.rowName}>Samsung S24 Ultra</Text>
                  <Text style={styles.rowDesc}>Titanium Gray • 256GB</Text>
                  <View style={styles.rowFooter}>
                    <Text style={styles.rowPrice}>25.490.000đ</Text>
                    <TouchableOpacity style={styles.smallAddBtn}><Feather name="plus" size={18} color="#fff" /></TouchableOpacity>
                  </View>
               </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  locationLabel: { fontSize: 12, color: '#ADB5BD' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 14, fontWeight: '700', color: '#212529' },
  headerIcons: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f1f1' },
  dotBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E63946', borderWidth: 1, borderColor: '#fff' },

  welcomeSection: { paddingHorizontal: 20, marginTop: 15 },
  welcomeTitle: { fontSize: 24, color: '#212529', lineHeight: 32 },
  boldText: { fontWeight: '900', fontSize: 28 },

  searchContainer: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fdfdfd' },
  searchInner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 15, paddingLeft: 15, height: 50 },
  input: { flex: 1, paddingHorizontal: 10, fontSize: 14 },
  filterBtn: { backgroundColor: '#212529', width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 5 },

  promoSection: { paddingHorizontal: 20, marginTop: 10 },
  promoCard: { height: 160, borderRadius: 25, overflow: 'hidden', flexDirection: 'row', padding: 20 },
  promoContent: { flex: 1, justifyContent: 'center' },
  promoBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  promoBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  promoTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  promoSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  promoBtn: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-start', marginTop: 15 },
  promoBtnText: { color: '#0077B6', fontWeight: '800', fontSize: 12 },
  promoImage: { width: 140, height: 140, position: 'absolute', right: -10, bottom: -20 },

  catList: { paddingHorizontal: 20, paddingVertical: 20 },
  catItem: { alignItems: 'center', marginRight: 25 },
  catIconBox: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catName: { fontSize: 12, fontWeight: '700', color: '#495057' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '900' },
  timerBox: { backgroundColor: '#ffe5ec', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  timerText: { color: '#fb6f92', fontWeight: '800', fontSize: 12 },
  seeAll: { color: '#00B4D8', fontWeight: '700' },

  flashCard: { width: 140, backgroundColor: '#fff', borderRadius: 20, padding: 10, marginRight: 15, borderWidth: 1, borderColor: '#f1f1f1' },
  flashImg: { width: '100%', height: 100, resizeMode: 'contain' },
  discountBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#fb6f92', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  discountText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  flashPrice: { fontSize: 14, fontWeight: '900', marginTop: 8, color: '#212529' },
  progressContainer: { marginTop: 8, height: 14, backgroundColor: '#f1f1f1', borderRadius: 7, justifyContent: 'center' },
  progressBar: { height: '100%', backgroundColor: '#ffb703', borderRadius: 7 },
  progressText: { position: 'absolute', width: '100%', textAlign: 'center', fontSize: 8, fontWeight: '800', color: '#495057' },

  tabWrapper: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 25, gap: 10 },
  tabBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: '#F8F9FA' },
  tabBtnActive: { backgroundColor: '#212529' },
  tabLabel: { fontSize: 14, fontWeight: '700', color: '#ADB5BD' },
  tabLabelActive: { color: '#fff' },

  verticalGrid: { paddingHorizontal: 20, marginTop: 15 },
  productRowCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 12, marginBottom: 15, alignItems: 'center', elevation: 2, shadowOpacity: 0.05 },
  rowImg: { width: 80, height: 80, borderRadius: 15 },
  rowContent: { flex: 1, marginLeft: 15 },
  rowName: { fontSize: 16, fontWeight: '800' },
  rowDesc: { fontSize: 12, color: '#ADB5BD', marginTop: 2 },
  rowFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  rowPrice: { fontSize: 16, fontWeight: '900', color: '#00B4D8' },
  smallAddBtn: { backgroundColor: '#212529', width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});