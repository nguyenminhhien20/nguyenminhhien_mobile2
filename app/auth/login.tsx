import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { API_CONFIG } from "../../apiConfig";

export default function MobileLogin() {
  const router = useRouter();
  
  // States quản lý nhập liệu
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Hiệu ứng Animation khi vào trang
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin đăng nhập");
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();
      
      // Giả lập delay 1s để người dùng thấy hiệu ứng loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const res = await fetch(API_CONFIG.USERS);
      const data = await res.json();

      // Kiểm tra user trong danh sách fetch về
      const user = data.content.find(
        (u: any) => u.email === email.trim() && u.pass === password
      );

      if (user) {
        // ĐĂNG NHẬP THÀNH CÔNG: Điều hướng vào nhóm Tabs chính
        router.replace("/(tabs)"); 
      } else {
        Alert.alert("Lỗi", "Email hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      Alert.alert("Lỗi kết nối", "Không thể kết nối tới máy chủ, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.mainContainer}>
        {/* NỀN ĐA SẮC */}
        <LinearGradient
          colors={["#0f172a", "#1e1b4b", "#020617"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* QUẢ CẦU PHÁT SÁNG (BLOB) */}
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.glassCard,
              { opacity, transform: [{ translateY }] },
            ]}
          >
            {/* LOGO SECTION */}
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={["#818cf8", "#6366f1"]}
                  style={styles.logoGradient}
                >
                  <Ionicons name="rocket" size={32} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={styles.welcomeText}>Chào mừng trở lại!</Text>
              <Text style={styles.subText}>Đăng nhập để khám phá công nghệ mới</Text>
            </View>

            {/* INPUT EMAIL */}
            <View style={[
                styles.inputWrapper, 
                focusedInput === 'email' && styles.inputWrapperFocused
            ]}>
              <Ionicons name="mail-outline" size={20} color={focusedInput === 'email' ? "#818cf8" : "#64748b"} />
              <TextInput
                placeholder="Địa chỉ Email"
                placeholderTextColor="#64748b"
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* INPUT PASSWORD */}
            <View style={[
                styles.inputWrapper, 
                focusedInput === 'pass' && styles.inputWrapperFocused
            ]}>
              <Ionicons name="lock-closed-outline" size={20} color={focusedInput === 'pass' ? "#818cf8" : "#64748b"} />
              <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor="#64748b"
                style={styles.textInput}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('pass')}
                onBlur={() => setFocusedInput(null)}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#94a3b8"
                />
              </Pressable>
            </View>

            <Pressable onPress={() => router.push('/forgotPassword')} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </Pressable>

            {/* NÚT ĐĂNG NHẬP */}
            <Pressable 
                onPress={handleLogin} 
                disabled={loading}
                style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
            >
              <LinearGradient
                colors={["#4f46e5", "#7c3aed"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Đăng Nhập</Text>
                )}
              </LinearGradient>
            </Pressable>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* MẠNG XÃ HỘI */}
            <View style={styles.socialRow}>
              <SocialIcon name="logo-google" color="#ef4444" />
              <SocialIcon name="logo-apple" color="#fff" />
              <SocialIcon name="logo-facebook" color="#0866ff" />
            </View>

            <Pressable onPress={() => router.push('/register')} style={styles.footerBtn}>
              <Text style={styles.footerText}>
                Bạn mới đến đây? <Text style={styles.signUpText}>Tạo tài khoản</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const SocialIcon = ({ name, color }: { name: any, color: string }) => (
  <View style={styles.socialBox}>
    <Ionicons name={name} size={24} color={color} />
  </View>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#020617" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  orb: { position: "absolute", width: 250, height: 250, borderRadius: 125, opacity: 0.2 },
  orb1: { backgroundColor: "#6366f1", top: -50, right: -50 },
  orb2: { backgroundColor: "#a855f7", bottom: 50, left: -80 },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 35,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  headerSection: { alignItems: "center", marginBottom: 30 },
  logoContainer: { marginBottom: 15, shadowColor: "#6366f1", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12 },
  logoGradient: { width: 70, height: 70, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  welcomeText: { fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  subText: { fontSize: 14, color: "#94a3b8", marginTop: 5 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, paddingHorizontal: 15, height: 60, marginBottom: 15, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)" },
  inputWrapperFocused: { borderColor: "#6366f1", backgroundColor: "rgba(99, 102, 241, 0.05)" },
  textInput: { flex: 1, marginLeft: 12, fontSize: 16, color: "#fff" },
  forgotBtn: { alignSelf: "flex-end", marginBottom: 25 },
  forgotText: { color: "#818cf8", fontSize: 14, fontWeight: "600" },
  loginButton: { height: 60, borderRadius: 16, justifyContent: "center", alignItems: "center", shadowColor: "#4f46e5", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
  loginButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" },
  dividerText: { marginHorizontal: 15, color: "#64748b", fontSize: 13 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 20, marginBottom: 30 },
  socialBox: { width: 60, height: 60, borderRadius: 18, backgroundColor: "rgba(255, 255, 255, 0.05)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)" },
  footerBtn: { alignItems: "center" },
  footerText: { color: "#94a3b8", fontSize: 15 },
  signUpText: { color: "#818cf8", fontWeight: "700" },
});