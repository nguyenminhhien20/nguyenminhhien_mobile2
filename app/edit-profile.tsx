import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../apiConfig";

export default function EditProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const [originalUser, setOriginalUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        const user = JSON.parse(data);
        setOriginalUser(user);
        
        // Đảm bảo cập nhật state ngay khi có dữ liệu
        setFullName(user.fullName || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
      }
    } catch (e) {
      console.log("Lỗi tải dữ liệu:", e);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim()) {
      return Alert.alert("Thông báo", "Vui lòng nhập đủ thông tin.");
    }

    if (!validateEmail(email)) {
      return Alert.alert("Thông báo", "Email không hợp lệ.");
    }

    if (!originalUser?.id) return;

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("FullName", fullName.trim());
      formData.append("Email", email.trim());
      formData.append("Phone", phone.trim());

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/User/${originalUser.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const result = await res.json();
      // Cập nhật lại bộ nhớ cục bộ sau khi lưu thành công
      await AsyncStorage.setItem("userData", JSON.stringify(result));

      Alert.alert("Thành công ✨", "Hồ sơ đã được cập nhật.");
      router.back();
    } catch {
      Alert.alert("Lỗi", "Không thể cập nhật hồ sơ.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1D1D1F" />
      </View>
    );
  }

  const avatarUri = originalUser?.avatar
    ? `${API_CONFIG.BASE_URL}/uploads/user/${originalUser.avatar}`
    : `https://ui-avatars.com/api/?name=${fullName}&background=F2F2F7&color=1D1D1F&size=200`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color="#1D1D1F" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={updating}
          style={styles.saveBtn}
        >
          {updating ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.saveText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity activeOpacity={0.8}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
              <View style={styles.camera}>
                <Feather name="camera" size={16} color="#1D1D1F" />
              </View>
            </TouchableOpacity>
            <Text style={styles.sub}>Nhấn để thay đổi ảnh</Text>
          </View>

          {/* Form Fields - Dữ liệu sẽ tự động điền vào đây nhờ state fullName, email, phone */}
          <InputItem
            label="Họ và tên"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nhập họ và tên"
            isActive={activeField === "name"}
            onFocus={() => setActiveField("name")}
            onBlur={() => setActiveField(null)}
          />

          <InputItem
            label="Email"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="example@gmail.com"
            isActive={activeField === "email"}
            onFocus={() => setActiveField("email")}
            onBlur={() => setActiveField(null)}
            autoCapitalize="none"
          />

          <InputItem
            label="Số điện thoại"
            value={phone}
            keyboardType="phone-pad"
            onChangeText={setPhone}
            placeholder="Chưa cập nhật số điện thoại"
            isActive={activeField === "phone"}
            onFocus={() => setActiveField("phone")}
            onBlur={() => setActiveField(null)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- Input Component ---------- */
const InputItem = ({
  label,
  isActive,
  onFocus,
  onBlur,
  value, // Nhận giá trị từ state
  ...props
}) => (
  <View style={[styles.inputBox, isActive && styles.active]}>
    <Text style={[styles.label, isActive && { color: "#007AFF" }]}>
      {label}
    </Text>
    <TextInput
      {...props}
      value={value} // Gán giá trị hiển thị cho TextInput
      style={styles.input}
      onFocus={onFocus}
      onBlur={onBlur}
      selectionColor="#007AFF"
      placeholderTextColor="#C7C7CC"
    />
  </View>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  center: { justifyContent: "center", alignItems: "center" },

  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  headerTitle: { fontSize: 17, fontWeight: "600", color: "#1D1D1F" },
  saveBtn: {
    backgroundColor: "#1D1D1F",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center'
  },
  saveText: { color: "#FFF", fontWeight: "600" },

  content: { padding: 24 },

  avatarSection: { alignItems: "center", marginBottom: 32 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#F2F2F7' },
  camera: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sub: { marginTop: 10, fontSize: 13, color: "#8E8E93" },

  inputBox: {
    backgroundColor: "#F9F9FB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2F2F7",
    padding: 16,
    marginBottom: 18,
  },
  active: {
    borderColor: "#007AFF",
    backgroundColor: "#FFF",
  },
  label: { fontSize: 12, color: "#8E8E93", marginBottom: 4 },
  input: { fontSize: 16, fontWeight: "500", color: "#1D1D1F", paddingVertical: 4 },
});