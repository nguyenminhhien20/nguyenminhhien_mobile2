import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, 
  TouchableOpacity, StatusBar, Platform, Alert, ActivityIndicator, Pressable
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from "../../apiConfig";

type CartItem = {
  id: number;
  productId: number;
  quantity: number;
  selected: boolean;
  product: {
    name: string;
    price: number;
    thumbnail: string;
  };
};

export default function RealCartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // --- HÀM THÔNG BÁO DÙNG CHUNG CHO WEB & MOBILE ---
  const universalAlert = (title: string, message: string, onConfirm?: () => void) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`${title}\n${message}`);
      if (confirmed && onConfirm) onConfirm();
    } else {
      Alert.alert(title, message, [
        { text: "Hủy", style: "cancel" },
        { text: "Đồng ý", style: "destructive", onPress: onConfirm }
      ]);
    }
  };

  // --- LẤY DỮ LIỆU AUTH (FIX CHO CẢ WEB/MOBILE) ---
  const getAuthData = async () => {
    try {
      let userStr, token;
      if (Platform.OS === 'web') {
        userStr = localStorage.getItem("userData");
        token = localStorage.getItem("userToken");
      } else {
        userStr = await AsyncStorage.getItem("userData");
        token = await AsyncStorage.getItem("userToken");
      }
      // Khử dấu ngoặc kép nếu token bị lưu dạng "abc" thay vì abc
      const cleanToken = token ? token.replace(/"/g, '') : null;
      return { user: userStr ? JSON.parse(userStr) : null, token: cleanToken };
    } catch (e) {
      return { user: null, token: null };
    }
  };

  // --- 1. TẢI GIỎ HÀNG ---
  const loadCartFromServer = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      const { user, token } = await getAuthData();
      if (!user?.id || !token) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Cart/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(Array.isArray(data) ? data.map((item: any) => ({ ...item, selected: false })) : []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCartFromServer();
    }, [])
  );

  // --- 2. CẬP NHẬT SỐ LƯỢNG ---
  const handleQuantity = async (id: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1 || isUpdating) return;

    setIsUpdating(true);
    const oldItems = [...cartItems];
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));

    try {
      const { token } = await getAuthData();
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Cart/update/${id}?quantity=${newQty}`, { 
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error();
    } catch (error) {
      setCartItems(oldItems);
      if (Platform.OS !== 'web') Alert.alert("Lỗi", "Không thể cập nhật");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- 3. XÓA 1 MÓN ---
  const handleDelete = (id: number) => {
    universalAlert("Xác nhận", "Xóa sản phẩm này khỏi giỏ hàng?", async () => {
      try {
        const { token } = await getAuthData();
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Cart/delete/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setCartItems(prev => prev.filter(item => item.id !== id));
        }
      } catch (e) {
        console.error(e);
      }
    });
  };

  // --- 4. XÓA CÁC MỤC ĐÃ TÍCH CHỌN ---
  const deleteSelectedItems = () => {
    const selectedIds = cartItems.filter(i => i.selected).map(i => i.id);
    if (selectedIds.length === 0) return;

    universalAlert("Xóa mục đã chọn", `Xóa ${selectedIds.length} sản phẩm đang chọn?`, async () => {
      try {
        setIsUpdating(true);
        const { token } = await getAuthData();
        await Promise.all(selectedIds.map(id => 
          fetch(`${API_CONFIG.BASE_URL}/api/Cart/delete/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ));
        setCartItems(prev => prev.filter(item => !item.selected));
      } catch (e) {
        loadCartFromServer();
      } finally {
        setIsUpdating(false);
      }
    });
  };

  // --- 5. XÓA SẠCH GIỎ HÀNG ---
  const clearAllCart = () => {
    if (cartItems.length === 0) return;
    universalAlert("Cảnh báo", "Xóa toàn bộ sản phẩm trong giỏ?", async () => {
      try {
        setIsUpdating(true);
        const { user, token } = await getAuthData();
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Cart/clear/${user.id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) setCartItems([]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsUpdating(false);
      }
    });
  };

  const totalPrice = useMemo(() => {
    return cartItems
      .filter(i => i.selected)
      .reduce((sum, i) => sum + (i.product?.price * i.quantity), 0);
  }, [cartItems]);

  const goToCheckout = () => {
    const selectedItems = cartItems.filter(i => i.selected);
    if (selectedItems.length === 0) {
      if (Platform.OS === 'web') window.alert("Vui lòng chọn sản phẩm!");
      else Alert.alert("Thông báo", "Vui lòng chọn sản phẩm để thanh toán");
      return;
    }
    router.push({
      pathname: '/checkout', 
      params: { items: JSON.stringify(selectedItems), total: totalPrice }
    });
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#000" /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Giỏ hàng</Text>
            <Text style={styles.countText}>{cartItems.length} sản phẩm</Text>
          </View>
          
          <View style={styles.headerActions}>
            {cartItems.some(i => i.selected) ? (
              <TouchableOpacity onPress={deleteSelectedItems} style={[styles.iconCircle, {backgroundColor: '#FFF2F2'}]}>
                <Feather name="trash-2" size={20} color="#FF3B30" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => loadCartFromServer(true)} style={styles.iconCircle}>
                {refreshing ? <ActivityIndicator size="small" color="#000" /> : <Ionicons name="reload-outline" size={20} color="#000" />}
              </TouchableOpacity>
            )}

            {cartItems.length > 0 && (
              <TouchableOpacity onPress={clearAllCart} style={[styles.iconCircle, {marginLeft: 12}]}>
                <MaterialCommunityIcons name="delete-sweep-outline" size={22} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {cartItems.length > 0 && (
          <TouchableOpacity 
            style={styles.selectAllRow}
            onPress={() => {
              const allSelected = cartItems.every(i => i.selected);
              setCartItems(prev => prev.map(i => ({...i, selected: !allSelected})));
            }}
          >
            <Ionicons name={cartItems.every(i => i.selected) && cartItems.length > 0 ? "checkmark-circle" : "ellipse-outline"} size={22} color={cartItems.every(i => i.selected) ? "#000" : "#C7C7CC"} />
            <Text style={styles.selectAllText}>Chọn tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIconBg}>
              <MaterialCommunityIcons name="shopping-outline" size={60} color="#D1D1D6" />
            </View>
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
            <TouchableOpacity style={styles.shopNow} onPress={() => router.push('/')}>
              <Text style={styles.shopNowText}>Mua sắm ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map(item => (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity 
                onPress={() => setCartItems(prev => prev.map(i => i.id === item.id ? {...i, selected: !i.selected} : i))}
                style={styles.checkboxContainer}
              >
                <View style={[styles.checkbox, item.selected && styles.checkboxActive]}>
                  {item.selected && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
              </TouchableOpacity>

              <Pressable style={styles.productContent} onPress={() => router.push(`/product/${item.productId}`)}>
                <Image 
                  source={{ uri: `${API_CONFIG.BASE_URL}/uploads/product/${item.product?.thumbnail}` }} 
                  style={styles.img} 
                />
                <View style={styles.details}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>{item.product?.name}</Text>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Feather name="x" size={18} color="#C7C7CC" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.price}>{item.product?.price?.toLocaleString()}₫</Text>
                  
                  <View style={styles.cardBottom}>
                    <View style={styles.qtyBox}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQuantity(item.id, item.quantity, -1)}>
                        <Feather name="minus" size={14} color="#000" />
                      </TouchableOpacity>
                      <Text style={styles.qtyNum}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQuantity(item.id, item.quantity, 1)}>
                        <Feather name="plus" size={14} color="#000" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.totalLabel}>Đã chọn ({cartItems.filter(i => i.selected).length})</Text>
            <Text style={styles.totalValue}>{totalPrice.toLocaleString()}₫</Text>
          </View>
          <TouchableOpacity 
            style={[styles.checkoutBtn, cartItems.filter(i => i.selected).length === 0 && {backgroundColor: '#CCC'}]} 
            onPress={goToCheckout}
            disabled={cartItems.filter(i => i.selected).length === 0}
          >
            <Text style={styles.checkoutText}>Đặt Hàng</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    backgroundColor: '#FFF', paddingHorizontal: 24, 
    paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: '#F2F2F7'
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  countText: { color: '#8E8E93', fontSize: 13, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center' 
  },
  selectAllRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  selectAllText: { marginLeft: 10, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  list: { padding: 20, paddingBottom: 150 },
  card: { 
    backgroundColor: '#FFF', borderRadius: 20, padding: 12, 
    flexDirection: 'row', alignItems: 'center', marginBottom: 16,
    ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
        android: { elevation: 2 },
        web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }
    })
  },
  checkboxContainer: { paddingRight: 10 },
  checkbox: { 
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, 
    borderColor: '#E5E5EA', justifyContent: 'center', alignItems: 'center' 
  },
  checkboxActive: { backgroundColor: '#000', borderColor: '#000' },
  productContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  img: { width: 85, height: 85, borderRadius: 15, backgroundColor: '#F9F9F9' },
  details: { flex: 1, marginLeft: 12 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', flex: 1 },
  price: { fontSize: 16, color: '#000', fontWeight: '800', marginTop: 4 },
  cardBottom: { marginTop: 8 },
  qtyBox: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#F5F5F5', borderRadius: 10, alignSelf: 'flex-start'
  },
  qtyBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  qtyNum: { marginHorizontal: 10, fontWeight: '700', fontSize: 13 },
  footer: { 
    position: 'absolute', bottom: 30, left: 16, right: 16,
    backgroundColor: '#FFF', padding: 16, borderRadius: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10
  },
  totalLabel: { fontSize: 12, color: '#8E8E93' },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  checkoutBtn: { 
    backgroundColor: '#1A1A1A', paddingHorizontal: 24, paddingVertical: 14, 
    borderRadius: 18
  },
  checkoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIconBg: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyText: { fontSize: 15, color: '#8E8E93' },
  shopNow: { marginTop: 20, backgroundColor: '#000', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  shopNowText: { color: '#FFF', fontWeight: '700' }
});