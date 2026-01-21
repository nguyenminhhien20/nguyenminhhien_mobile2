import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- IMPORT SERVICE ---
import { loginUserByEmail } from "../../Services/apiService";

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // --- LOGIC ĐĂNG NHẬP ĐÃ ĐƯỢC CẬP NHẬT TRƯỜNG PASSWORD ---
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert(
        "Thông báo",
        "Vui lòng nhập đầy đủ Email và Mật khẩu.",
      );
    }

    setLoading(true);
    try {
      // 1. Gọi API Login
      const result = await loginUserByEmail(
        email.toLowerCase().trim(),
        password.trim(),
      );

      // 2. Kiểm tra Token và ID
      const realToken = result?.token;
      const userId = result?.id;

      if (realToken && userId) {
        // CHUẨN HÓA DỮ LIỆU: Thêm password vào để phục vụ trang Change Password
        const userSession = {
          id: userId,
          name: result?.fullName || "User",
          email: result?.email || email,
          role: result?.role || "customer",
          password: password.trim(), // <--- QUAN TRỌNG: Lưu lại để so sánh mật khẩu cũ
        };

        // 3. Lưu trữ vào AsyncStorage
        if (Platform.OS === "web") {
          localStorage.setItem("userToken", realToken);
          localStorage.setItem("userId", String(userId));
          localStorage.setItem("userData", JSON.stringify(userSession));
        } else {
          await AsyncStorage.setItem("userToken", realToken);
          await AsyncStorage.setItem("userId", String(userId));
          await AsyncStorage.setItem("userData", JSON.stringify(userSession));
        }

        console.log("✅ Đăng nhập thành công, đã lưu mật khẩu vào máy.");
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Lỗi",
          "Tài khoản không hợp lệ hoặc thiếu dữ liệu từ máy chủ.",
        );
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Email hoặc mật khẩu không chính xác.";
      Alert.alert("Thất bại", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const handleBiometricAuth = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        return Alert.alert("Thông báo", "Thiết bị không hỗ trợ sinh trắc học.");
      }

      const resultAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Xác thực tài khoản MEI",
        fallbackLabel: "Nhập mật khẩu",
      });

      if (resultAuth.success) {
        const token =
          Platform.OS === "web"
            ? localStorage.getItem("userToken")
            : await AsyncStorage.getItem("userToken");

        if (token) {
          router.replace("/(tabs)");
        } else {
          Alert.alert(
            "Yêu cầu",
            "Vui lòng đăng nhập thủ công lần đầu để kích hoạt.",
          );
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Xác thực sinh trắc học thất bại.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#000", "#0a0a0a", "#111"]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.logoWrap}>
              <View style={styles.logoBox}>
                <Text style={styles.logoIcon}>M</Text>
              </View>
              <Text style={styles.brandName}>
                MEI ATELIER <Text style={styles.brandThin}>DESIGN</Text>
              </Text>
            </View>

            <Text style={styles.title}>Đăng nhập</Text>
            <Text style={styles.subtitle}>
              Chào mừng bạn trở lại với không gian công nghệ
            </Text>

            <View style={styles.form}>
              <InputBox
                label="ĐỊA CHỈ GMAIL"
                icon="mail"
                placeholder="example@gmail.com"
                keyboardType="email-address"
                active={activeInput === "email"}
                onFocus={() => setActiveInput("email")}
                onBlur={() => setActiveInput(null)}
                onChangeText={setEmail}
                value={email}
              />
              <InputBox
                label="MẬT KHẨU"
                icon="lock"
                placeholder="••••••••"
                secure={!showPass}
                isPass
                active={activeInput === "pass"}
                onFocus={() => setActiveInput("pass")}
                onBlur={() => setActiveInput(null)}
                showPass={showPass}
                setShowPass={setShowPass}
                onChangeText={setPassword}
                value={password}
              />

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotBtn}
              >
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mainBtn, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.mainBtnText}>TIẾP TỤC</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.socialSection}>
              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>KẾT NỐI ĐA NỀN TẢNG</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialBtns}>
                <SocialButton
                  icon={<FontAwesome5 name="google" size={18} color="#FFF" />}
                />
                <SocialButton
                  icon={<FontAwesome5 name="apple" size={20} color="#FFF" />}
                />
                <SocialButton
                  icon={<FontAwesome5 name="facebook" size={20} color="#FFF" />}
                />

                <TouchableOpacity
                  style={[styles.sBtn, styles.biometricBtn]}
                  onPress={handleBiometricAuth}
                >
                  <MaterialCommunityIcons
                    name="fingerprint"
                    size={28}
                    color="#FFF"
                  />
                  <View style={styles.activeDot} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.footer}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={styles.footerText}>
                Bạn chưa có tài khoản?{" "}
                <Text style={styles.footerLink}>Đăng ký ngay</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// --- SUB-COMPONENTS ---
const InputBox = ({
  label,
  icon,
  active,
  isPass,
  showPass,
  setShowPass,
  secure,
  ...props
}: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputContainer, active && styles.inputActive]}>
      <Feather name={icon} size={16} color={active ? "#FFF" : "#444"} />
      <TextInput
        style={styles.textInput}
        placeholderTextColor="#444"
        autoCapitalize="none"
        secureTextEntry={secure}
        {...props}
      />
      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons
            name={showPass ? "eye-off" : "eye"}
            size={18}
            color="#444"
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const SocialButton = ({ icon }: any) => (
  <TouchableOpacity style={styles.sBtn}>{icon}</TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollContent: { paddingHorizontal: 35, paddingTop: 60, paddingBottom: 40 },
  logoWrap: { alignItems: "center", marginBottom: 40 },
  logoBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#111",
  },
  logoIcon: { color: "#FFF", fontSize: 24, fontWeight: "300" },
  brandName: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 5,
    marginTop: 12,
  },
  brandThin: { color: "#333", fontWeight: "300" },
  title: { color: "#FFF", fontSize: 28, fontWeight: "bold" },
  subtitle: { color: "#444", fontSize: 13, marginTop: 5, marginBottom: 35 },
  form: { gap: 15 },
  inputGroup: { gap: 8 },
  inputLabel: {
    color: "#666",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 58,
    backgroundColor: "#050505",
    borderRadius: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#111",
  },
  inputActive: { borderColor: "#FFF" },
  textInput: { flex: 1, color: "#FFF", marginLeft: 12, fontSize: 15 },
  forgotBtn: { alignSelf: "flex-end", paddingVertical: 5 },
  forgotText: { color: "#666", fontSize: 12, fontWeight: "500" },
  mainBtn: {
    backgroundColor: "#FFF",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  mainBtnText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 1,
  },
  socialSection: { marginTop: 45 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 25,
  },
  line: { flex: 1, height: 1, backgroundColor: "#111" },
  dividerText: {
    color: "#333",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  socialBtns: { flexDirection: "row", justifyContent: "center", gap: 12 },
  sBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#080808",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#111",
  },
  biometricBtn: {
    backgroundColor: "#111",
    borderColor: "#333",
    width: 60,
    height: 60,
    borderRadius: 20,
  },
  activeDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
  },
  footer: { marginTop: 40, alignItems: "center" },
  footerText: { color: "#444", fontSize: 13 },
  footerLink: { color: "#FFF", fontWeight: "bold" },
});
