import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image, 
  TouchableOpacity, Dimensions, SafeAreaView, StatusBar, 
  TextInput, Platform, ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from "../../apiConfig";

const { width } = Dimensions.get('window');

export default function MeiPremiumStore() {
  const router = useRouter();
  
  // States
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0); 
  
  // Data States
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]); 
  
  // Selection States
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // --- LOGIC GIỎ HÀNG ---
  const updateCartCount = async () => {
    try {
      let userStr, token;
      if (Platform.OS === 'web') {
        userStr = localStorage.getItem("userData");
        token = localStorage.getItem("userToken");
      } else {
        userStr = await AsyncStorage.getItem("userData");
        token = await AsyncStorage.getItem("userToken");
      }
      if (!userStr || !token) {
        setCartCount(0);
        return;
      }
      const user = JSON.parse(userStr);
      const cleanToken = token.replace(/"/g, '');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Cart/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const total = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
          setCartCount(total);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
    }
  };

  useFocusEffect(useCallback(() => { updateCartCount(); }, []));

  // --- TẢI DỮ LIỆU ---
  const loadData = async () => {
    try {
      const [brandRes, catRes, prodRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/api/Brand`), 
        fetch(`${API_CONFIG.BASE_URL}/api/Category`),
        fetch(`${API_CONFIG.BASE_URL}/api/Product`) 
      ]);
      const brandData = await brandRes.json();
      const catData = await catRes.json();
      const prodData = await prodRes.json();
      setBrands(Array.isArray(brandData) ? brandData : (brandData.content || []));
      setCategories(Array.isArray(catData) ? catData : (catData.content || []));
      
      // Lọc bỏ sản phẩm null nếu có
      const products = Array.isArray(prodData) ? prodData : (prodData.content || []);
      setAllProducts(products.filter(p => p !== null));
    } catch (error) { 
      console.error("Lỗi fetch data:", error); 
    }
  };

  useEffect(() => { loadData().finally(() => setLoading(false)); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateCartCount();
    loadData().finally(() => setRefreshing(false));
  }, []);

  // --- LOGIC LỌC SẢN PHẨM ---
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (selectedBrandId !== null) {
      result = result.filter(p => p.brandId === selectedBrandId || p.brand?.id === selectedBrandId);
    }
    if (selectedCategoryId !== null) {
      result = result.filter(p => p.categoryId === selectedCategoryId || p.category?.id === selectedCategoryId);
    }
    if (searchQuery.trim() !== '') {
      const keyword = searchQuery.toLowerCase().trim();
      result = result.filter(p => (p.name || "").toLowerCase().includes(keyword));
    }
    return result;
  }, [selectedBrandId, selectedCategoryId, searchQuery, allProducts]);

  const isFiltering = useMemo(() => {
    return searchQuery.trim() !== '' || selectedBrandId !== null || selectedCategoryId !== null;
  }, [searchQuery, selectedBrandId, selectedCategoryId]);

  const resolveImg = (type, item) => {
    if (!item) return { uri: 'https://via.placeholder.com/150' };
    const fileName = type === 'products' ? item?.thumbnail : (item?.image || item?.photo || item?.imagePath);
    return { uri: API_CONFIG.IMAGE_URL(type, fileName) };
  };

  const handleBrandPress = (id) => {
    if (selectedBrandId === id) {
        setSelectedBrandId(null);
        setSelectedCategoryId(null);
    } else {
        setSelectedBrandId(id);
        setSelectedCategoryId(null);
    }
  };

  const handleProductPress = (id) => {
    if (!id) return;
    router.push({ pathname: '/product/[id]', params: { id: id.toString() } });
  };

  const resetFilters = () => {
    setSelectedBrandId(null);
    setSelectedCategoryId(null);
    setSearchQuery('');
  };

  const renderProductRow = (item) => (
    <TouchableOpacity key={item.id} style={styles.modernRowCard} onPress={() => handleProductPress(item.id)}>
      <Image source={resolveImg('products', item)} style={styles.modernRowImgFull} />
      <View style={styles.modernRowInfo}>
        <Text style={styles.modernRowBrand}>PREMIUM SELECTION</Text>
        <Text style={styles.modernRowName}>{item.name}</Text>
        <Text style={styles.modernRowPrice}>{item.price?.toLocaleString()}đ</Text>
      </View>
      <View style={styles.modernRowAction}><Feather name="plus" size={18} color="#000" /></View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          {!isSearching ? (
            <>
              <View style={styles.brandContainer}>
                <LinearGradient colors={['#1D1D1F', '#434343']} style={styles.logoBoxMei}>
                  <Text style={styles.logoTextMei}>M</Text>
                </LinearGradient>
                <View style={styles.brandTextWrapper}>
                  <Text style={styles.brandTitleMei}>
                    MEI<Text style={{fontWeight: '300', color: '#8E8E93'}}> TECHNOLOGY</Text>
                  </Text>
                  <View style={styles.statusBadge}>
                    <View style={styles.dotActive} />
                    <Text style={styles.brandSubMei}>PREMIUM TECH EXPERIENCE</Text>
                  </View>
                </View>
              </View>

              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => setIsSearching(true)}>
                  <Feather name="search" size={20} color="#1D1D1F" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/cart')}>
                  <Feather name="shopping-bag" size={20} color="#1D1D1F" />
                  {cartCount > 0 && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.searchBarWrapper}>
              <View style={styles.searchInputContainer}>
                <Feather name="search" size={18} color="#8E8E93" style={{marginLeft: 12}} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm theo tên sản phẩm..."
                  autoFocus
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity onPress={() => {setIsSearching(false); setSearchQuery('');}}>
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />}
      >
        {/* Banner Hero Cập Nhật */}
        <View style={styles.heroWrapper}>
          <TouchableOpacity activeOpacity={0.95} onPress={() => setSelectedBrandId(null)}>
            <LinearGradient 
              colors={['#0F0F0F', '#232323']} 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 1}} 
              style={styles.heroCard}
            >
              <View style={styles.glowSpotlight} />
              <View style={styles.heroContent}>
                <View style={styles.premiumTag}>
                  <Text style={styles.premiumTagText}>ECOSYSTEM SALES</Text>
                </View>
                <Text style={styles.heroTitle}>Trọn bộ</Text>
                <Text style={styles.heroTitleHighlight}>Apple Store.</Text>
                <Text style={styles.heroSubTitle} numberOfLines={2}>
                  Nâng tầm trải nghiệm với hệ sinh thái công nghệ đỉnh cao.
                </Text>
                <View style={styles.heroBtnMoi}>
                  <Text style={styles.heroBtnTextMoi}>Khám phá</Text>
                  <Ionicons name="chevron-forward" size={14} color="#000" />
                </View>
              </View>

              <View style={styles.imageStage}>
                <Image source={{ uri: 'https://pngimg.com/uploads/macbook/macbook_PNG65.png' }} style={styles.imgMacbook} />
                <Image source={{ uri: 'https://pngimg.com/uploads/iphone_14/iphone_14_PNG19.png' }} style={styles.imgIphone} />
                <Image source={{ uri: 'https://pngimg.com/uploads/airpods/airpods_PNG18.png' }} style={styles.imgAirpods} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{marginTop: 50}}><ActivityIndicator size="large" color="#000" /></View>
        ) : (
          <>
            <View style={styles.brandSection}>
              <Text style={styles.sectionHeaderLabel}>THƯƠNG HIỆU</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandScroll}>
                {brands.map((brand) => (
                  <TouchableOpacity 
                    key={brand.id} 
                    onPress={() => handleBrandPress(brand.id)}
                    activeOpacity={0.7}
                    style={[styles.brandPill, selectedBrandId === brand.id && styles.brandPillActive]}
                  >
                    <Text style={[styles.brandPillText, selectedBrandId === brand.id && styles.brandPillTextActive]}>
                      {brand.name.toUpperCase()}
                    </Text>
                    {selectedBrandId === brand.id && <View style={styles.activeDot} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {selectedBrandId && (
              <View style={styles.subCatWrapper}>
                <Text style={styles.sectionHeaderLabel}>DANH MỤC SẢN PHẨM</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandScroll}>
                  {categories.map((cat) => (
                    <TouchableOpacity 
                      key={cat.id} 
                      style={[styles.categoryChip, selectedCategoryId === cat.id && styles.categoryChipActive]}
                      onPress={() => setSelectedCategoryId(prev => prev === cat.id ? null : cat.id)}
                    >
                      <Text style={[styles.categoryChipText, selectedCategoryId === cat.id && { color: '#fff' }]}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>{isFiltering ? 'KẾT QUẢ TÌM KIẾM' : 'SẢN PHẨM NỔI BẬT'}</Text>
                {isFiltering && (
                  <TouchableOpacity style={styles.refreshIconBtn} onPress={resetFilters}>
                      <Ionicons name="reload-outline" size={18} color="#007AFF" />
                  </TouchableOpacity>
                )}
              </View>

              {isFiltering ? (
                <View style={styles.newList}>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => renderProductRow(item))
                  ) : (
                    <View style={styles.emptyView}><Text style={styles.emptyText}>Không tìm thấy sản phẩm.</Text></View>
                  )}
                </View>
              ) : (
                <View style={styles.bentoContainer}>
                  {filteredProducts.length >= 3 ? (
                    <>
                      <TouchableOpacity style={styles.cardLarge} onPress={() => handleProductPress(filteredProducts[0].id)} activeOpacity={0.9}>
                        <Image source={resolveImg('products', filteredProducts[0])} style={styles.pImgFull} />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.infoOverlay}>
                          <Text style={styles.pNameOverlay} numberOfLines={1}>{filteredProducts[0].name}</Text>
                          <Text style={styles.pPriceOverlay}>{filteredProducts[0].price?.toLocaleString()}đ</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <View style={styles.bentoCol}>
                        {filteredProducts.slice(1, 3).map((item) => (
                          <TouchableOpacity key={item.id} style={styles.cardSmall} onPress={() => handleProductPress(item.id)} activeOpacity={0.9}>
                            <Image source={resolveImg('products', item)} style={styles.pImgFull} />
                            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.infoOverlaySmall}>
                              <Text style={styles.pNameOverlaySmall} numberOfLines={1}>{item.name}</Text>
                              <Text style={styles.pPriceOverlaySmall}>{item.price?.toLocaleString()}đ</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  ) : (
                    filteredProducts.map(item => renderProductRow(item))
                  )}
                </View>
              )}
            </View>

            {!isFiltering && filteredProducts.length > 3 && (
              <View style={[styles.section, {marginBottom: 30}]}>
                <Text style={styles.sectionHeaderLabel}>KHÁM PHÁ THÊM</Text>
                <View style={styles.newList}>
                  {filteredProducts.slice(3).map((item) => renderProductRow(item))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFBFD' },
  safeHeader: { backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60 },
  brandContainer: { flexDirection: 'row', alignItems: 'center' },
  logoBoxMei: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  logoTextMei: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  brandTextWrapper: { marginLeft: 10 },
  brandTitleMei: { fontSize: 16, fontWeight: '800', color: '#1D1D1F' },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  dotActive: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#34C759', marginRight: 4 },
  brandSubMei: { fontSize: 7, color: '#8E8E93', fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  badgeContainer: { position: 'absolute', top: -4, right: -4, backgroundColor: '#FF3B30', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderWidth: 1.5, borderColor: '#fff' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  searchBarWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 10, height: 38 },
  searchInput: { flex: 1, fontSize: 14, paddingHorizontal: 8, color: '#000' },
  cancelText: { color: '#007AFF', fontSize: 14, fontWeight: '600' },
  scrollContent: { paddingBottom: 60 },
  
  // Banner Styles
  heroWrapper: { paddingHorizontal: 16, paddingVertical: 20 },
  heroCard: { height: 240, borderRadius: 32, padding: 24, flexDirection: 'row', overflow: 'hidden', position: 'relative' },
  glowSpotlight: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(255, 255, 255, 0.05)', top: -40, right: -20 },
  heroContent: { flex: 1.2, justifyContent: 'center', zIndex: 20 },
  premiumTag: { backgroundColor: '#007AFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 10 },
  premiumTagText: { color: '#fff', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  heroTitleHighlight: { color: '#fff', fontSize: 24, fontWeight: '300', opacity: 0.9 },
  heroSubTitle: { color: '#8E8E93', fontSize: 12, marginTop: 10, lineHeight: 16 },
  heroBtnMoi: { backgroundColor: '#fff', marginTop: 20, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 18, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 5 },
  heroBtnTextMoi: { color: '#000', fontWeight: '700', fontSize: 12 },
  imageStage: { flex: 1, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  imgMacbook: { width: 200, height: 200, resizeMode: 'contain', position: 'absolute', right: -40, bottom: -10, zIndex: 1 },
  imgIphone: { width: 100, height: 100, resizeMode: 'contain', position: 'absolute', right: 50, bottom: 20, zIndex: 5, transform: [{ rotate: '-10deg' }] },
  imgAirpods: { width: 70, height: 70, resizeMode: 'contain', position: 'absolute', right: 0, top: 40, zIndex: 10 },

  brandSection: { marginTop: 10, marginBottom: 5 },
  brandScroll: { paddingLeft: 20, paddingBottom: 10 },
  brandPill: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: '#FFFFFF', borderRadius: 25, marginRight: 10, borderWidth: 1, borderColor: '#F2F2F7', flexDirection: 'row', alignItems: 'center', elevation: 2 },
  brandPillActive: { backgroundColor: '#1D1D1F', borderColor: '#1D1D1F' },
  brandPillText: { fontSize: 12, fontWeight: '700', color: '#86868B', letterSpacing: 0.5 },
  brandPillTextActive: { color: '#FFFFFF' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#007AFF', marginLeft: 6 },
  subCatWrapper: { marginTop: 5, backgroundColor: '#F2F2F7', paddingVertical: 15 },
  categoryChip: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#E5E5EA' },
  categoryChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  categoryChipText: { fontSize: 12, fontWeight: '600', color: '#1D1D1F' },
  section: { marginTop: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionLabel: { fontSize: 12, fontWeight: '900', color: '#1D1D1F', letterSpacing: 1 },
  refreshIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  sectionHeaderLabel: { paddingHorizontal: 20, fontSize: 12, fontWeight: '900', color: '#1D1D1F', marginBottom: 15 },
  bentoContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, height: 320 },
  cardLarge: { flex: 1.4, borderRadius: 24, overflow: 'hidden', backgroundColor: '#fff', elevation: 3 },
  bentoCol: { flex: 1, gap: 12 },
  cardSmall: { flex: 1, borderRadius: 24, overflow: 'hidden', backgroundColor: '#fff', elevation: 3 },
  pImgFull: { width: '100%', height: '100%', resizeMode: 'cover' },
  infoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, height: '60%', justifyContent: 'flex-end' },
  infoOverlaySmall: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, height: '70%', justifyContent: 'flex-end' },
  pNameOverlay: { color: '#fff', fontSize: 18, fontWeight: '800' },
  pPriceOverlay: { color: '#E5E5EA', fontSize: 14, fontWeight: '600', marginTop: 4 },
  pNameOverlaySmall: { color: '#fff', fontSize: 13, fontWeight: '700' },
  pPriceOverlaySmall: { color: '#E5E5EA', fontSize: 12, fontWeight: '500', marginTop: 2 },
  newList: { paddingHorizontal: 20 },
  modernRowCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 8, marginBottom: 12, borderWidth: 1, borderColor: '#F2F2F7', elevation: 1 },
  modernRowImgFull: { width: 80, height: 80, borderRadius: 16, resizeMode: 'cover' },
  modernRowInfo: { flex: 1, marginLeft: 15 },
  modernRowBrand: { fontSize: 8, color: '#8E8E93', fontWeight: '800' },
  modernRowName: { fontSize: 14, fontWeight: '700', color: '#1D1D1F', marginTop: 2 },
  modernRowPrice: { fontSize: 14, fontWeight: '700', color: '#007AFF', marginTop: 4 },
  modernRowAction: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  emptyView: { width: '100%', paddingVertical: 40, alignItems: 'center' },
  emptyText: { color: '#8E8E93', fontSize: 13 },
});