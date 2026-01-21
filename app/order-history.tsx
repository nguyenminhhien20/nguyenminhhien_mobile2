import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, Image, 
  TouchableOpacity, ActivityIndicator, Platform, SafeAreaView, StatusBar, Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from "../apiConfig";

export default function OrderHistory() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = Platform.OS === 'web' 
        ? localStorage.getItem("userToken") 
        : await AsyncStorage.getItem("userToken");

      const cleanToken = token?.replace(/"/g, '');

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Order/user`, {
        headers: { 
          'Authorization': `Bearer ${cleanToken}`, 
          'Accept': 'application/json' 
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm thông báo dùng chung cho Web và Mobile
  const showNotify = (title, message, onPressOk = null) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm(`${title}: ${message}`);
      if (confirm && onPressOk) onPressOk();
    } else {
      Alert.alert(title, message, [
        { text: "Đóng", style: "cancel" },
        { text: "Đồng ý", onPress: onPressOk }
      ]);
    }
  };

  const handleCancelOrder = (id) => {
    const action = async () => {
      try {
        const token = Platform.OS === 'web' ? localStorage.getItem("userToken") : await AsyncStorage.getItem("userToken");
        const cleanToken = token?.replace(/"/g, '');
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/Order/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${cleanToken}` }
        });

        if (response.ok) {
          showNotify("Thành công", "Đơn hàng đã được hủy.");
          loadOrders(); 
        }
      } catch (error) {
        showNotify("Lỗi", "Không thể hủy đơn hàng.");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) action();
    } else {
      Alert.alert("Xác nhận", "Hủy đơn hàng này?", [
        { text: "Quay lại", style: "cancel" },
        { text: "Hủy đơn", style: "destructive", onPress: action }
      ]);
    }
  };

  // --- LOGIC MUA LẠI CHUẨN ---
  const handleReorder = async (orderDetails) => {
    try {
      setLoading(true);
      const token = Platform.OS === 'web' ? localStorage.getItem("userToken") : await AsyncStorage.getItem("userToken");
      const userId = Platform.OS === 'web' ? localStorage.getItem("userId") : await AsyncStorage.getItem("userId");
      const cleanToken = token?.replace(/"/g, '');

      if (!cleanToken) {
        router.push('/login');
        return;
      }

      // Gửi sản phẩm lên API giỏ hàng
      const promises = orderDetails.map(item => 
        fetch(`${API_CONFIG.BASE_URL}/api/Cart/add`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            productId: item.productId,
            userId: parseInt(userId || "0"),
            quantity: item.quantity
          })
        })
      );

      await Promise.all(promises);

      // Thông báo và chuyển hướng
      showNotify("Thành công", "Đã thêm vào giỏ hàng. Đi đến giỏ hàng ngay?", () => {
        router.push('/cart');
      });

    } catch (error) {
      showNotify("Lỗi", "Không thể mua lại sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 0: return { label: "Chờ xác nhận", color: "#FF9500" };
      case 1: return { label: "Đang giao", color: "#007AFF" };
      case 2: return { label: "Đã hoàn thành", color: "#34C759" };
      case 3: return { label: "Đã hủy", color: "#FF3B30" };
      default: return { label: "Đang xử lý", color: "#8E8E93" };
    }
  };

  const renderOrderItem = ({ item }) => {
    const status = getStatusInfo(item.status);

    return (
      <View style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <View style={styles.orderIdGroup}>
            <Feather name="hash" size={16} color="#1D1D1F" />
            <Text style={styles.orderIdText}>Mã đơn: #{item.id}</Text>
          </View>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>

        <View style={styles.divider} />

        {item.orderDetails?.map((detail, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.productRow}
            onPress={() => router.push(`/product/${detail.productId}`)}
          >
            <Image 
              source={{ uri: API_CONFIG.IMAGE_URL('products', detail.product?.thumbnail) }} 
              style={styles.productImg}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{detail.product?.name}</Text>
              <Text style={styles.productQty}>Số lượng: x{detail.quantity}</Text>
              <Text style={styles.productPrice}>{detail.price?.toLocaleString()}₫</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View style={styles.totalRow}>
            <Text style={styles.itemCount}>{item.orderDetails?.length || 0} sản phẩm</Text>
            <View style={styles.priceGroup}>
              <Text style={styles.totalLabel}>Thành tiền: </Text>
              <Text style={styles.totalValue}>{(item.totalAmount || 0).toLocaleString()}₫</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            {item.status === 0 ? (
              <TouchableOpacity 
                style={[styles.btnAction, { borderColor: '#FF3B30', borderWidth: 1 }]}
                onPress={() => handleCancelOrder(item.id)}
              >
                <Text style={{ color: '#FF3B30', fontWeight: '700' }}>Hủy đơn hàng</Text>
              </TouchableOpacity>
            ) : item.status === 1 ? (
              <TouchableOpacity 
                style={[styles.btnAction, { backgroundColor: '#007AFF' }]}
                onPress={() => showNotify("Vận chuyển", "Đơn hàng đang trên đường giao.")}
              >
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Xem vận chuyển</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.btnAction, { backgroundColor: '#1D1D1F' }]}
                onPress={() => handleReorder(item.orderDetails)}
              >
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Mua lại</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.btnAction, { borderColor: '#E5E5EA', borderWidth: 1 }]}
              onPress={() => router.push(`/order/${item.id}`)}
            >
              <Text style={{ color: '#48484A', fontWeight: '600' }}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1D1D1F" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={28} color="#1D1D1F" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn mua của tôi</Text>
        <TouchableOpacity onPress={loadOrders}><Feather name="rotate-cw" size={20} color="#1D1D1F" /></TouchableOpacity>
      </View>

      <FlatList 
        data={orders} 
        renderItem={renderOrderItem} 
        keyExtractor={(item) => item.id.toString()} 
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, height: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA'
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  listPadding: { padding: 12 },
  orderCard: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 12, elevation: 2, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  orderIdGroup: { flexDirection: 'row', alignItems: 'center' },
  orderIdText: { fontSize: 15, fontWeight: '700', marginLeft: 6, color: '#1D1D1F' },
  statusText: { fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginHorizontal: 16 },
  productRow: { flexDirection: 'row', padding: 16 },
  productImg: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F2F2F7' },
  productInfo: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  productName: { fontSize: 15, fontWeight: '600' },
  productQty: { fontSize: 12, color: '#8E8E93' },
  productPrice: { fontSize: 15, fontWeight: '700', color: '#1D1D1F' },
  cardFooter: { padding: 16 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  itemCount: { fontSize: 12, color: '#8E8E93' },
  priceGroup: { flexDirection: 'row', alignItems: 'baseline' },
  totalLabel: { fontSize: 13 },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#FF3B30' },
  actionRow: { flexDirection: 'row-reverse', gap: 10 },
  btnAction: { 
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, 
    minWidth: 110, alignItems: 'center' 
  }
});