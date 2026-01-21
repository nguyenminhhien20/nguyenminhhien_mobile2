import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

// IMPORT SERVICE 
import { registerUser } from "../../Services/apiService";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    numphone: "",
    password: "",
    confirm: "",
  });

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password || !form.numphone) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ các thông tin bắt buộc.");
      return;
    }

    if (form.password !== form.confirm) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    try {
      setLoading(true);

      // CHUẨN BỊ PAYLOAD KHỚP VỚI MODEL C#
      const userData = {
        fullName: form.username.trim(),
        email: form.email.trim(),
        phone: form.numphone.trim(),
        password: form.password,
      };

      await registerUser(userData);

      Alert.alert("Thành công 🎉", "Tài khoản của bạn đã sẵn sàng.", [
        { text: "Đăng nhập", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      const errorMsg = error.response?.status === 404 
        ? "Lỗi 404: Không tìm thấy đường dẫn API /api/User" 
        : "Đăng ký thất bại. Vui lòng kiểm tra lại kết nối hoặc dữ liệu.";
      Alert.alert("Thất bại", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#000", "#0a0a0a", "#111"]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaWrapper>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <View style={styles.logoWrap}>
                <View style={styles.logoBox}>
                  <Text style={styles.logoIcon}>M</Text>
                </View>
                <Text style={styles.brandName}>
                  MEI TECH <Text style={styles.brandThin}>DESIGN</Text>
                </Text>
              </View>

              <Text style={styles.title}>Tạo tài khoản</Text>
              <Text style={styles.subtitle}>
                Bắt đầu hành trình công nghệ của bạn
              </Text>

              <View style={styles.form}>
                <CustomInput
                  label="TÊN ĐĂNG NHẬP"
                  icon="user"
                  placeholder="Username"
                  active={activeInput === "user"}
                  onFocus={() => setActiveInput("user")}
                  onBlur={() => setActiveInput(null)}
                  onChangeText={(t: string) =>
                    setForm({ ...form, username: t })
                  }
                />

                <CustomInput
                  label="ĐỊA CHỈ EMAIL"
                  icon="mail"
                  placeholder="name@example.com"
                  active={activeInput === "email"}
                  onFocus={() => setActiveInput("email")}
                  onBlur={() => setActiveInput(null)}
                  onChangeText={(t: string) => setForm({ ...form, email: t })}
                />

                <CustomInput
                  label="SỐ ĐIỆN THOẠI"
                  icon="phone"
                  placeholder="090xxxxxxx"
                  active={activeInput === "phone"}
                  onFocus={() => setActiveInput("phone")}
                  onBlur={() => setActiveInput(null)}
                  keyboardType="phone-pad"
                  onChangeText={(t: string) =>
                    setForm({ ...form, numphone: t })
                  }
                />

                <CustomInput
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
                  onChangeText={(t: string) =>
                    setForm({ ...form, password: t })
                  }
                />

                <CustomInput
                  label="XÁC NHẬN MẬT KHẨU"
                  icon="shield"
                  placeholder="••••••••"
                  secure={!showPass}
                  active={activeInput === "confirm"}
                  onFocus={() => setActiveInput("confirm")}
                  onBlur={() => setActiveInput(null)}
                  onChangeText={(t: string) => setForm({ ...form, confirm: t })}
                />

                <TouchableOpacity
                  style={styles.mainBtn}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.mainBtnText}>ĐĂNG KÝ NGAY</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.socialSection}>
                <View style={styles.dividerRow}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>
                  <View style={styles.line} />
                </View>

                {/* ĐÃ SỬA: Thay <div> bằng <View> để các icon nằm ngang */}
                <View style={styles.socialBtns}>
                  <SocialButton icon="google" color="#EA4335" />
                  <SocialButton icon="facebook" color="#1877F2" />
                  <SocialButton icon="apple" color="#FFF" />
                </View>
              </View>

              <TouchableOpacity
                style={styles.footer}
                onPress={() => router.push("/(auth)/login")}
              >
                <Text style={styles.footerText}>
                  Bạn đã có tài khoản?{" "}
                  <Text style={styles.footerLink}>Đăng nhập</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaWrapper>
    </View>
  );
}

// --- SUB-COMPONENTS ---
const CustomInput = ({
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
        placeholderTextColor="#333"
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

const SocialButton = ({ icon, color }: any) => (
  <TouchableOpacity style={styles.sBtn}>
    <FontAwesome5 name={icon} size={20} color={color} />
  </TouchableOpacity>
);

const SafeAreaWrapper = ({ children }: any) => (
  <View style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 50 : 20 }}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollContent: { paddingHorizontal: 35, paddingBottom: 40 },
  logoWrap: { alignItems: "center", marginTop: 20, marginBottom: 40 },
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
  logoIcon: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  brandName: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 4,
    marginTop: 12,
  },
  brandThin: { color: "#333", fontWeight: "300" },
  title: { color: "#FFF", fontSize: 32, fontWeight: "bold", letterSpacing: -1 },
  subtitle: { color: "#444", fontSize: 13, marginTop: 5, marginBottom: 30 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  inputLabel: {
    color: "#222",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "#050505",
    borderRadius: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#111",
  },
  inputActive: { borderColor: "#333", backgroundColor: "#080808" },
  textInput: { flex: 1, color: "#FFF", marginLeft: 12, fontSize: 15 },
  mainBtn: {
    backgroundColor: "#FFF",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  mainBtnText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },
  socialSection: { marginTop: 40 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 25,
  },
  line: { flex: 1, height: 1, backgroundColor: "#111" },
  dividerText: { color: "#222", fontSize: 10, fontWeight: "900" },
  socialBtns: { 
    flexDirection: "row", // Ép các icon nằm cùng một hàng ngang
    justifyContent: "center", 
    gap: 20 
  },
  sBtn: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#111",
  },
  footer: { marginTop: 40, alignItems: "center" },
  footerText: { color: "#444", fontSize: 13 },
  footerLink: { color: "#FFF", fontWeight: "bold" },
});