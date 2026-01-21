import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../../apiConfig";

export default function MeiProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  
  // State quản lý số lượng giỏ hàng và tin nhắn
  const [cartCount, setCartCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);

  /**
   * Tự động load lại dữ liệu mỗi khi người dùng quay lại tab Profile
   */
  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
      loadBadgeCounts();
    }, []),
  );

  const checkLoginStatus = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      if (jsonValue) {
        setUserData(JSON.parse(jsonValue));
      } else {
        setUserData(null);
      }
    } catch (e) {
      console.error("Lỗi đọc dữ liệu user:", e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * SỬA TẠI ĐÂY: Lấy số lượng sản phẩm thật từ giỏ hàng
   */
  const loadBadgeCounts = async () => {
    try {
      // Lấy dữ liệu giỏ hàng (thường lưu dưới key 'cart')
      const cartData = await AsyncStorage.getItem("cart");
      if (cartData) {
        const cartItems = JSON.parse(cartData);
        // Nếu giỏ hàng là mảng, đếm số lượng phần tử
        if (Array.isArray(cartItems)) {
          setCartCount(cartItems.length);
        } else {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }

      // Giả lập tin nhắn hoặc lấy từ API
      setMsgCount(1); 
    } catch (e) {
      console.error("Lỗi tải badge:", e);
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    const logoutAction = async () => {
      try {
        const keys = ["userData", "userToken", "userId"];
        await AsyncStorage.multiRemove(keys);
        setUserData(null);
        if (Platform.OS === "web") {
          window.location.href = "/login"; 
        } else {
          router.replace("/(auth)/login");
        }
      } catch (e) {
        Alert.alert("Lỗi", "Không thể đăng xuất lúc này.");
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Bạn chắc chắn muốn đăng xuất ?")) logoutAction();
    } else {
      Alert.alert("Xác nhận", "Bạn chắc chắn muốn đăng xuất?", [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: logoutAction },
      ]);
    }
  };

  const navigateToHistory = () => {
    if (!userData) {
      Alert.alert("Yêu cầu", "Vui lòng đăng nhập để thực hiện.", [
        { text: "Để sau", style: "cancel" },
        { text: "Đăng nhập", onPress: () => router.push("/(auth)/login") }
      ]);
      return;
    }
    router.push("/order-history");
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#1D1D1F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* TOP NAVIGATION */}
      <View style={styles.topNav}>
        <Text style={styles.navTitle}>Tài khoản</Text>
        <View style={styles.navActions}>
          
          {/* Nút Giỏ hàng - Hiển thị cartCount thật */}
          <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/cart")}>
            <Ionicons name="bag-outline" size={22} color="#1D1D1F" />
            {cartCount > 0 && (
              <View style={styles.badgeNumber}>
                <Text style={styles.badgeText}>{cartCount > 9 ? "9+" : cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Nút Tin nhắn */}
          <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/")}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#1D1D1F" />
            {msgCount > 0 && (
              <View style={[styles.badgeNumber, { backgroundColor: '#FF3B30' }]}>
                <Text style={styles.badgeText}>{msgCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.navBtn}>
            <Feather name="settings" size={20} color="#1D1D1F" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* THẺ NGƯỜI DÙNG */}
        <View style={styles.userCard}>
          {userData ? (
            <TouchableOpacity
              style={styles.loggedInRow}
              onPress={() => router.push("/edit-profile")}
              activeOpacity={0.7}
            >
              <Image
                source={{
                  uri: (userData.avatar || userData.photo)
                      ? `${API_CONFIG.BASE_URL}/uploads/user/${userData.avatar || userData.photo}`
                      : `https://ui-avatars.com/api/?name=${userData.fullName || 'User'}&background=0D0D0D&color=fff`,
                }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {userData.fullName || "Người dùng "}
                  </Text>
                  <View style={styles.editIconCircle}>
                    <MaterialCommunityIcons name="pencil" size={12} color="#8E8E93" />
                  </View>
                </View>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {userData.email || "Thành viên MEI ATELIER"}
                </Text>
                <LinearGradient colors={["#1D1D1F", "#434343"]} style={styles.memberTag}>
                  <Text style={styles.memberText}>THÀNH VIÊN CHÍNH THỨC</Text>
                </LinearGradient>
              </View>
              <Feather name="chevron-right" size={20} color="#D1D1D6" />
            </TouchableOpacity>
          ) : (
            <View style={styles.guestContainer}>
              <View style={styles.guestInfo}>
                <Text style={styles.guestTitle}>Chào mừng đến với MEI</Text>
                <Text style={styles.guestSub}>Đăng nhập để xem đơn hàng và ưu đãi</Text>
              </View>
              <View style={styles.guestActionRow}>
                <TouchableOpacity style={styles.miniLoginBtn} onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.miniLoginText}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.miniRegBtn} onPress={() => router.push("/(auth)/register")}>
                  <Text style={styles.miniRegText}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* QUẢN LÝ ĐƠN HÀNG */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>
            <TouchableOpacity onPress={navigateToHistory}>
              <Text style={styles.seeAllText}>Xem lịch sử</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statusRow}>
            <StatusItem icon="credit-card" type="feather" label="Chờ xác nhận" />
            <StatusItem icon="archive" type="feather" label="Chờ lấy hàng" />
            <StatusItem icon="truck" type="feather" label="Chờ giao hàng" />
            <StatusItem icon="chatbubble-check-outline" type="ionicons" label="Đánh giá/Trả hàng" />
          </View>
        </View>

        {/* DANH SÁCH MENU CHI TIẾT */}
        <View style={styles.menuCard}>
          <TouchableOpacity onPress={() => userData && router.push("/")}>
            <MenuRow icon="map-pin" label="Địa chỉ" subLabel="Quản lý địa chỉ nhận hàng" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => userData && router.push("/")}>
            <MenuRow icon="gift" label="Ưu đãi của tôi" subLabel="Mã giảm giá và quà tặng" badge={true} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => userData && router.push("/")}>
            <MenuRow icon="message-square" label="Đánh giá của tôi" subLabel="Lịch sử nhận xét sản phẩm" />
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToHistory}>
            <MenuRow icon="clock" label="Lịch sử đơn hàng" subLabel="Xem lại các sản phẩm đã mua" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => userData && router.push("/(auth)/change-password")}>
            <MenuRow icon="lock" label="Bảo mật tài khoản" subLabel="Đổi mật khẩu & xác thực" />
          </TouchableOpacity>

          <TouchableOpacity>
            <MenuRow icon="help-circle" label="Trung tâm hỗ trợ" subLabel="Liên hệ MEI để được giải đáp" isLast />
          </TouchableOpacity>
        </View>

        {userData && (
          <TouchableOpacity activeOpacity={0.8} style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.versionText}>MEI ATELIER • Phiên bản 2.2.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

/**
 * Các Component con
 */
const StatusItem = ({ icon, label, type, onPress }: any) => (
  <TouchableOpacity style={styles.statusItem} onPress={onPress} disabled={!onPress}>
    <View style={styles.statusIconBox}>
      {type === 'feather' && <Feather name={icon} size={22} color="#1D1D1F" />}
      {type === 'material' && <MaterialCommunityIcons name={icon} size={24} color="#1D1D1F" />}
      {type === 'ionicons' && <Ionicons name={icon} size={22} color="#1D1D1F" />}
    </View>
    <Text style={styles.statusLabel} numberOfLines={1}>{label}</Text>
  </TouchableOpacity>
);

const MenuRow = ({ icon, label, subLabel, isLast, badge }: any) => (
  <View style={[styles.menuRow, !isLast && styles.rowBorder]}>
    <View style={styles.rowLeft}>
      <View style={styles.iconSquare}>
         <Feather name={icon} size={18} color="#1D1D1F" />
      </View>
      <View style={styles.labelContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.rowLabel}>{label}</Text>
          {badge && <View style={styles.dotBadge} />}
        </View>
        <Text style={styles.rowSubLabel}>{subLabel}</Text>
      </View>
    </View>
    <Feather name="chevron-right" size={16} color="#D1D1D6" />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8FA" },
  topNav: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: Platform.OS === "ios" ? 60 : 40, paddingBottom: 15,
    backgroundColor: "#FFF",
  },
  navTitle: { fontSize: 26, fontWeight: "800", color: "#1D1D1F" },
  navActions: { flexDirection: 'row', gap: 10 },
  navBtn: { 
    width: 44, height: 44, backgroundColor: "#F2F2F7", borderRadius: 14, 
    justifyContent: "center", alignItems: "center", position: 'relative' 
  },
  badgeNumber: {
    position: 'absolute', top: -5, right: -5, backgroundColor: '#007AFF', 
    minWidth: 18, height: 18, borderRadius: 10, justifyContent: 'center', 
    alignItems: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: '#FFF'
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  scrollContent: { paddingTop: 10 },
  userCard: { 
    backgroundColor: "#FFF", padding: 20, marginHorizontal: 20, borderRadius: 28, 
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 
  },
  loggedInRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#F2F2F7" },
  userInfo: { flex: 1, marginLeft: 15 },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  userName: { fontSize: 19, fontWeight: "bold", color: "#1D1D1F" },
  editIconCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#F2F2F7", justifyContent: "center", alignItems: "center", marginLeft: 8 },
  userEmail: { fontSize: 13, color: "#8E8E93" },
  memberTag: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: 8 },
  memberText: { fontSize: 9, fontWeight: "800", color: "#FFF" },
  guestContainer: { paddingVertical: 5 },
  guestTitle: { fontSize: 18, fontWeight: "bold", color: "#1D1D1F" },
  guestSub: { fontSize: 13, color: "#8E8E93", marginBottom: 15 },
  guestActionRow: { flexDirection: "row", gap: 12 },
  miniLoginBtn: { backgroundColor: "#1D1D1F", flex: 1, paddingVertical: 12, borderRadius: 15, alignItems: 'center' },
  miniLoginText: { color: "#FFF", fontWeight: "bold" },
  miniRegBtn: { backgroundColor: "#FFF", flex: 1, paddingVertical: 12, borderRadius: 15, borderWidth: 1, borderColor: "#E5E5EA", alignItems: 'center' },
  miniRegText: { color: "#1D1D1F", fontWeight: "bold" },
  sectionCard: { backgroundColor: "#FFF", paddingVertical: 20, marginHorizontal: 20, borderRadius: 28, marginTop: 15 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#1D1D1F" },
  seeAllText: { fontSize: 13, color: "#007AFF", fontWeight: "600" },
  statusRow: { flexDirection: "row", paddingHorizontal: 10 },
  statusItem: { flex: 1, alignItems: "center" },
  statusIconBox: { width: 52, height: 52, backgroundColor: "#F8F8FA", borderRadius: 18, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  statusLabel: { fontSize: 11, color: "#48484A", fontWeight: "600", textAlign: 'center' },
  menuCard: { backgroundColor: "#FFF", marginHorizontal: 20, borderRadius: 28, marginTop: 15, overflow: "hidden" },
  menuRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, paddingHorizontal: 20 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#F2F2F7" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 15, flex: 1 },
  iconSquare: { width: 40, height: 40, backgroundColor: '#F8F8FA', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  labelContainer: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: "600", color: "#1D1D1F" },
  rowSubLabel: { fontSize: 12, color: "#8E8E93", marginTop: 2 },
  dotBadge: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF3B30', marginLeft: 6 },
  logoutBtn: { marginHorizontal: 20, marginTop: 20, paddingVertical: 16, alignItems: "center", backgroundColor: "#FFF", borderRadius: 22, borderWidth: 1, borderColor: "#FFEBEB" },
  logoutText: { color: "#FF3B30", fontWeight: "bold", fontSize: 16 },
  versionText: { textAlign: "center", color: "#C7C7CC", fontSize: 11, marginTop: 30 },
});