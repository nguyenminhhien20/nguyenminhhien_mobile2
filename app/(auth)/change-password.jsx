import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, Alert, StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from "../../apiConfig";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleChangePassword = async () => {
    // 1. Kiểm tra đầu vào phía Client
    if (!oldPass || !newPass || !confirmPass) {
      return Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.");
    }
    if (newPass !== confirmPass) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không trùng khớp.");
    }
    if (newPass.length < 6) {
      return Alert.alert("Lỗi", "Mật khẩu mới phải từ 6 ký tự trở lên.");
    }

    setLoading(true);
    try {
      // 2. Lấy thông tin User hiện tại từ bộ nhớ máy
      const userRaw = await AsyncStorage.getItem("userData");
      if (!userRaw) {
        setLoading(false);
        return Alert.alert("Lỗi", "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      const user = JSON.parse(userRaw);

      // 3. Kiểm tra mật khẩu cũ (So sánh với field 'password' từ API trả về)
      // Lưu ý: Backend của bạn dùng trường 'password' (viết hoa P hoặc thường tùy Model)
      const currentStoredPass = user.password || user.pass; 
      if (oldPass !== currentStoredPass) {
        setLoading(false);
        return Alert.alert("Lỗi", "Mật khẩu hiện tại không chính xác.");
      }

      // 4. Chuẩn bị FormData (Vì Backend dùng [FromForm] UserUpdateRequest)
      const formData = new FormData();
      formData.append('Password', newPass.trim());
      // Bạn có thể append thêm FullName, Email nếu API yêu cầu không được để trống
      // Ở đây logic Backend của bạn có check !string.IsNullOrWhiteSpace nên chỉ gửi Password là đủ.

      console.log("Đang cập nhật mật khẩu cho ID:", user.id);

      // 5. Gọi API PUT
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/User/${user.id}`, {
        method: 'PUT',
        headers: { 
          'Accept': 'application/json',
          // Khi dùng FormData, không set Content-Type thủ công để fetch tự xử lý boundary
        },
        body: formData,
      });

      // 6. Xử lý kết quả
      if (response.ok) {
        const updatedUser = await response.json();
        
        // Cập nhật lại userData trong AsyncStorage với mật khẩu mới
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
        
        Alert.alert("Thành công", "Mật khẩu của bạn đã được cập nhật.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        const errorText = await response.text();
        console.error("Lỗi Server:", errorText);
        Alert.alert("Thất bại", "Không thể cập nhật mật khẩu. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      Alert.alert("Lỗi kết nối", "Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#000", "#111"]} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="chevron-left" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.intro}>
              <Text style={styles.title}>Bảo mật</Text>
              <Text style={styles.subtitle}>Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản.</Text>
            </View>

            <View style={styles.form}>
              <PasswordField 
                label="MẬT KHẨU HIỆN TẠI" 
                value={oldPass} 
                onChangeText={setOldPass} 
                show={showOldPass} 
                onToggle={() => setShowOldPass(!showOldPass)} 
              />
              <PasswordField 
                label="MẬT KHẨU MỚI" 
                value={newPass} 
                onChangeText={setNewPass} 
                show={showNewPass} 
                onToggle={() => setShowNewPass(!showNewPass)} 
              />
              <PasswordField 
                label="XÁC NHẬN MẬT KHẨU" 
                value={confirmPass} 
                onChangeText={setConfirmPass} 
                show={showConfirmPass} 
                onToggle={() => setShowConfirmPass(!showConfirmPass)} 
              />

              <TouchableOpacity 
                style={[styles.mainBtn, loading && { opacity: 0.6 }]} 
                onPress={handleChangePassword} 
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.mainBtnText}>CẬP NHẬT MẬT KHẨU</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const PasswordField = ({ label, value, onChangeText, show, onToggle }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <TextInput 
        secureTextEntry={!show} 
        value={value} 
        onChangeText={onChangeText} 
        style={styles.textInput} 
        placeholderTextColor="#444" 
        autoCapitalize="none"
        placeholder="••••••••"
      />
      <TouchableOpacity onPress={onToggle} style={styles.eyeIcon}>
        <Ionicons name={show ? "eye-off" : "eye"} size={20} color="#555" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15, 
    height: 60 
  },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  backBtn: { padding: 5 },
  scrollContent: { paddingHorizontal: 30, paddingTop: 20 },
  intro: { marginBottom: 30 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#666', fontSize: 14, marginTop: 8 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { color: "#555", fontSize: 11, fontWeight: "bold" },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    height: 55, 
    backgroundColor: "#0A0A0A", 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    borderWidth: 1, 
    borderColor: "#222" 
  },
  textInput: { flex: 1, color: "#FFF", fontSize: 16 },
  eyeIcon: { padding: 5 },
  mainBtn: { 
    backgroundColor: '#FFF', 
    height: 55, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20 
  },
  mainBtnText: { color: '#000', fontWeight: 'bold', letterSpacing: 0.5 }
});