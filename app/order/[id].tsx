import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, 
  TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, Alert, StatusBar, Modal, Dimensions 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { API_CONFIG } from "../../apiConfig";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => { if (id) fetchOrderDetail(); }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const token = Platform.OS === 'web' ? localStorage.getItem("userToken") : await AsyncStorage.getItem("userToken");
      const cleanToken = token?.replace(/"/g, '');

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Order/${id}`, {
        headers: { 'Authorization': `Bearer ${cleanToken}`, 'Accept': 'application/json' }
      });
      if (response.ok) {
        setOrder(await response.json());
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  // LOGIC HỦY ĐƠN HÀNG
  const handleCancelOrder = async () => {
    if(!cancelReason) {
      Alert.alert("Lỗi", "Vui lòng chọn lý do hủy");
      return;
    }

    try {
      setIsCancelModalVisible(false);
      setLoading(true);

      const token = Platform.OS === 'web' ? localStorage.getItem("userToken") : await AsyncStorage.getItem("userToken");
      const cleanToken = token?.replace(/"/g, '');

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Order/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: cancelReason })
      });

      if (response.ok) {
        Alert.alert("Thành công", "Đơn hàng của bạn đã được hủy bỏ.", [
          { text: "OK", onPress: () => fetchOrderDetail() }
        ]);
      } else {
        Alert.alert("Thất bại", "Không thể hủy đơn hàng này.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Kết nối máy chủ thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return order?.orderDetails?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 0;
  };

  const getStatusInfo = (status: any) => {
    const s = Number(status);
    switch(s) {
      case 0: return { label: "Chờ xác nhận", color: "#FF9500", icon: "clock", bg: "#FFF9F0" };
      case 1: return { label: "Đang giao", color: "#007AFF", icon: "truck", bg: "#F0F7FF" };
      case 2: return { label: "Hoàn thành", color: "#34C759", icon: "check-circle", bg: "#F0FFF4" };
      case 3: return { label: "Đã hủy", color: "#FF3B30", icon: "x-circle", bg: "#FFF0F0" };
      default: return { label: "Đang xử lý", color: "#1D1D1F", icon: "loader", bg: "#F2F2F7" };
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1D1D1F" /></View>;
  if (!order) return <View style={styles.center}><Text>Đơn hàng không tồn tại</Text></View>;

  const status = getStatusInfo(order.status);
  const subtotal = calculateSubtotal();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1D1D1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="share" size={20} color="#1D1D1F" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
        
        <LinearGradient colors={['#1D1D1F', '#2C2C2E']} style={styles.statusBanner}>
          <View>
            <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
              <Text style={styles.statusBadgeText}>{status.label}</Text>
            </View>
            <Text style={styles.orderDate}>Mã đơn: #Number{order.id}</Text>
            <Text style={styles.orderDate}>Đặt lúc: {new Date(order.createdAt).toLocaleTimeString()} - {new Date(order.createdAt).toLocaleDateString('vi-VN')}</Text>
          </View>
          <Feather name={status.icon as any} size={40} color="#FFF" />
        </LinearGradient>

        {/* Thông tin khách hàng - ĐÃ CẬP NHẬT LABEL */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-sharp" size={20} color="#1D1D1F" />
            <Text style={styles.cardTitle}>Thông tin nhận hàng</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.addressLine}>
              <Text style={styles.labelHeader}>Tên người nhận: </Text>
              <Text style={styles.userName}>{order.fullName || order.name || "Khách hàng MEI"}</Text>
            </Text>
            <Text style={styles.addressLine}>
              <Text style={styles.labelHeader}>Số điện thoại: </Text>
              <Text style={styles.phoneText}>{order.phoneNumber || order.phone || "Chưa có SĐT"}</Text>
            </Text>
            <Text style={styles.addressLine}>
              <Text style={styles.labelHeader}>Email: </Text>
              <Text style={styles.emailText}>{order.email || "Chưa cập nhật email"}</Text>
            </Text>
            <Text style={styles.addressLine}>
              <Text style={styles.labelHeader}>Địa chỉ nhận hàng: </Text>
              <Text style={styles.addressText}>{order.address || "Địa chỉ chưa cập nhật"}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="cube" size={20} color="#1D1D1F" />
            <Text style={styles.cardTitle}>Sản phẩm đã chọn</Text>
          </View>
          {order.orderDetails?.map((item: any, idx: number) => (
            <View key={idx} style={styles.productRow}>
              <Image 
                source={{ uri: `${API_CONFIG.BASE_URL}/uploads/product/${item.product?.thumbnail}` }} 
                style={styles.productImg} 
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.product?.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>{item.price?.toLocaleString()}₫</Text>
                  <Text style={styles.productQty}>x{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.mainCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tiền hàng</Text>
            <Text style={styles.summaryValue}>{subtotal.toLocaleString()}₫</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>{(order.shippingFee || 0).toLocaleString()}₫</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalValue}>{(subtotal + (order.shippingFee || 0)).toLocaleString()}₫</Text>
          </View>
          <View style={styles.paymentMethodChip}>
            <MaterialCommunityIcons name="wallet-outline" size={16} color="#8E8E93" />
            <Text style={styles.methodText}>Phương thức: {order.paymentMethod || "Tiền mặt"}</Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER NÚT HỦY */}
      {(Number(order.status) === 0 || !order.status) && (
        <View style={styles.footerAction}>
          <TouchableOpacity 
            style={styles.cancelBigBtn} 
            onPress={() => setIsCancelModalVisible(true)}
          >
            <Feather name="x-circle" size={20} color="#FF3B30" />
            <Text style={styles.cancelBigBtnText}>Yêu cầu hủy đơn hàng này</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal lý do hủy */}
      <Modal visible={isCancelModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tại sao bạn muốn hủy?</Text>
            {["Đổi ý, không mua nữa", "Tìm thấy giá rẻ hơn", "Sai địa chỉ/SĐT", "Thời gian giao quá lâu"].map((r) => (
              <TouchableOpacity key={r} style={styles.reasonBtn} onPress={() => setCancelReason(r)}>
                <Text style={[styles.reasonText, cancelReason === r && styles.reasonActiveText]}>{r}</Text>
                {cancelReason === r && <Ionicons name="checkmark-circle" size={20} color="#007AFF" />}
              </TouchableOpacity>
            ))}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.backModalBtn} onPress={() => setIsCancelModalVisible(false)}>
                <Text style={{color: '#8E8E93'}}>Quay lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmModalBtn} onPress={handleCancelOrder}>
                <Text style={{color: '#FFF', fontWeight: '700'}}>Xác nhận hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1D1D1F' },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  statusBanner: { margin: 20, padding: 24, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8 },
  statusBadgeText: { color: '#FFF', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  orderDate: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  mainCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 16, borderRadius: 20, padding: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1D1D1F', marginLeft: 8 },
  
  // Style mới cho địa chỉ
  addressBox: { backgroundColor: '#F9F9F9', padding: 16, borderRadius: 16 },
  addressLine: { marginBottom: 6 },
  labelHeader: { fontSize: 14, color: '#8E8E93', fontWeight: '500' },
  userName: { fontSize: 15, fontWeight: '700', color: '#1D1D1F' },
  phoneText: { fontSize: 14, color: '#1D1D1F', fontWeight: '600' },
  addressText: { fontSize: 14, color: '#444', lineHeight: 20 },

  productRow: { flexDirection: 'row', marginBottom: 20 },
  productImg: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#F2F2F7' },
  productInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  productName: { fontSize: 15, fontWeight: '600', color: '#1D1D1F', marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  productPrice: { fontSize: 16, fontWeight: '700', color: '#1D1D1F' },
  productQty: { color: '#8E8E93', fontWeight: '600' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  summaryLabel: { color: '#8E8E93', fontSize: 14 },
  summaryValue: { fontWeight: '600', color: '#1D1D1F' },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '800' },
  totalValue: { fontSize: 22, fontWeight: '900', color: '#FF3B30' },
  paymentMethodChip: { flexDirection: 'row', alignItems: 'center', marginTop: 16, alignSelf: 'flex-start' },
  methodText: { fontSize: 12, color: '#8E8E93', marginLeft: 6, fontWeight: '500' },
  footerAction: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  cancelBigBtn: { height: 56, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#FF3B30', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  cancelBigBtnText: { color: '#FF3B30', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 28, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  reasonBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 8, backgroundColor: '#F9F9F9' },
  reasonText: { fontSize: 15, color: '#444' },
  reasonActiveText: { color: '#007AFF', fontWeight: '700' },
  modalFooter: { flexDirection: 'row', marginTop: 20, gap: 12 },
  backModalBtn: { flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' },
  confirmModalBtn: { flex: 2, height: 50, backgroundColor: '#1D1D1F', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }
});