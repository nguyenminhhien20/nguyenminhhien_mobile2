import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Image, ScrollView, 
  TouchableOpacity, SafeAreaView, StatusBar, 
  ActivityIndicator, Dimensions, Alert, Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from "../../apiConfig";

const { width, height } = Dimensions.get('window');

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Product/${id}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Fetch product error:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleToggleWishlist = async () => {
    if (isLiking || !product) return;
    try {
      setIsLiking(true);
      const token = Platform.OS === 'web' ? localStorage.getItem("userToken") : await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Yêu cầu", "Vui lòng đăng nhập để lưu sản phẩm.", [
          { text: "Để sau", style: "cancel" },
          { text: "Đăng nhập", onPress: () => router.push('/(auth)/login') }
        ]);
        return;
      }
      setLiked(!liked);
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });
      if (!response.ok) {
        setLiked(liked);
        throw new Error();
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thực hiện thao tác này.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddToCart = async () => {
    if (isAdding || !product) return;
    try {
      setIsAdding(true);
      let token = Platform.OS === 'web' ? localStorage.getItem("userToken") : await AsyncStorage.getItem("userToken");
      let userIdFromStorage = Platform.OS === 'web' ? localStorage.getItem("userId") : await AsyncStorage.getItem("userId");

      if (!token || !userIdFromStorage || userIdFromStorage === "N/A") {
        router.push('/(auth)/login');
        return;
      }

      const response = await fetch(API_CONFIG.CART_ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: parseInt(Array.isArray(id) ? id[0] : id),
          userId: parseInt(userIdFromStorage),
          quantity: 1
        })
      });

      if (response.ok) Alert.alert("🛒 Thành công", "Đã thêm vào túi hàng!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#1D1D1F" />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER TỐI GIẢN */}
      <SafeAreaView style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
            <Ionicons name="chevron-back" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn} onPress={() => router.push('/cart')}>
            <Feather name="shopping-bag" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 140}}>
        {/* IMAGE SECTION - Làm giống ảnh mẫu */}
        <View style={styles.imageSection}>
          <LinearGradient colors={['#FBFBFD', '#FFFFFF']} style={styles.imgBg}>
            <Image 
              source={{ uri: `${API_CONFIG.BASE_URL}/uploads/product/${product.thumbnail}` }} 
              style={styles.mainImg} 
              resizeMode="contain"
            />
          </LinearGradient>
          <View style={styles.labelContainer}>
             <Text style={styles.newLabel}>SẢN PHẨM MỚI</Text>
          </View>
        </View>

        {/* INFO SECTION */}
        <View style={styles.infoSection}>
          <View style={styles.dragHandle} />
          
          <Text style={styles.categoryName}>{product.category?.name || "PREMIUM"}</Text>
          <Text style={styles.productTitle}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{product.price?.toLocaleString()}₫</Text>
            <View style={styles.tagFreeShip}>
              <Text style={styles.tagText}>FREESHIP</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Grid đặc điểm theo style Apple */}
          <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <MaterialCommunityIcons name="cpu-64-bit" size={24} color="#1D1D1F" />
              <Text style={styles.specLabel}>Mạnh mẽ</Text>
            </View>
            <View style={styles.specBox}>
              <MaterialCommunityIcons name="battery-charging" size={24} color="#1D1D1F" />
              <Text style={styles.specLabel}>Pin lâu</Text>
            </View>
            <View style={styles.specBox}>
              <MaterialCommunityIcons name="shield-check-outline" size={24} color="#1D1D1F" />
              <Text style={styles.specLabel}>Bảo mật</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Về sản phẩm này</Text>
          <Text style={styles.descriptionText}>
            {product.description || "Được thiết kế để mang lại hiệu suất vượt trội và vẻ đẹp tối giản bền bỉ theo thời gian."}
          </Text>
        </View>
      </ScrollView>

      {/* FOOTER ACTION BAR - Hiện đại hơn */}
      <View style={styles.footerBar}>
        <TouchableOpacity 
          style={[styles.likeBtn, liked && styles.likeBtnActive]} 
          onPress={handleToggleWishlist}
        >
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={26} 
            color={liked ? "#FF3B30" : "#1D1D1F"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buyBtn} onPress={handleAddToCart}>
          <LinearGradient 
            colors={['#1D1D1F', '#434343']} 
            start={{x:0, y:0}} end={{x:1, y:0}}
            style={styles.buyBtnGradient}
          >
            {isAdding ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buyBtnText}>Thêm vào giỏ hàng</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fixedHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
  circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  
  imageSection: { width: width, height: height * 0.45, backgroundColor: '#FBFBFD' },
  imgBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainImg: { width: '90%', height: '90%' },
  labelContainer: { position: 'absolute', bottom: 60, left: 25 },
  newLabel: { backgroundColor: '#000', color: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, fontSize: 10, fontWeight: '900', overflow: 'hidden' },

  infoSection: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -30, paddingHorizontal: 25, paddingTop: 10, paddingBottom: 50 },
  dragHandle: { width: 40, height: 5, backgroundColor: '#E5E5EA', borderRadius: 3, alignSelf: 'center', marginBottom: 25 },
  categoryName: { fontSize: 12, fontWeight: '700', color: '#8E8E93', letterSpacing: 1.2 },
  productTitle: { fontSize: 30, fontWeight: '800', color: '#1D1D1F', marginTop: 5 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  currentPrice: { fontSize: 24, fontWeight: '700', color: '#1D1D1F' },
  tagFreeShip: { backgroundColor: '#F2F2F7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginLeft: 15 },
  tagText: { color: '#007AFF', fontSize: 11, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginVertical: 30 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1D1D1F', marginBottom: 15 },
  specsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  specBox: { width: (width - 80) / 3, height: 80, backgroundColor: '#FBFBFD', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F2F2F7' },
  specLabel: { fontSize: 11, fontWeight: '600', marginTop: 8, color: '#48484A' },
  descriptionText: { fontSize: 15, color: '#48484A', lineHeight: 24 },

  footerBar: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: 25, paddingBottom: Platform.OS === 'ios' ? 35 : 20, paddingTop: 15, backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  likeBtn: { width: 60, height: 60, borderRadius: 20, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  likeBtnActive: { backgroundColor: '#FFEBEB' },
  buyBtn: { flex: 1, height: 60, borderRadius: 20, overflow: 'hidden' },
  buyBtnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buyBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});