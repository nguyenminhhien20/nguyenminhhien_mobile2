import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, Eye, ArrowRight, Shield, Zap, Headphones } from "lucide-react-native";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <LinearGradient
      colors={["#6D28D9", "#7C3AED", "#2563EB"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        
        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✨ Nền tảng đáng tin cậy #1</Text>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>
          Trải nghiệm{" "}
          <Text style={styles.headingGradient}>tuyệt vời{"\n"}hơn bao giờ hết</Text>
        </Text>

        <Text style={styles.description}>
          Tham gia cùng hàng nghìn người dùng đã tin tưởng và sử dụng nền tảng của chúng tôi.
        </Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Shield color="#fff" size={26} />
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Bảo mật</Text>
          </View>

          <View style={styles.statCard}>
            <Zap color="#fff" size={26} />
            <Text style={styles.statNumber}>Nhanh</Text>
            <Text style={styles.statLabel}>Siêu tốc độ</Text>
          </View>

          <View style={styles.statCard}>
            <Headphones color="#fff" size={26} />
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Hỗ trợ</Text>
          </View>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Đăng nhập</Text>
          <Text style={styles.loginSubtitle}>Chào mừng bạn! Vui lòng nhập thông tin.</Text>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Mail color="#7C3AED" size={20} />
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor="#888"
              style={styles.input}
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Lock color="#7C3AED" size={20} />
            <TextInput
              secureTextEntry={!passwordVisible}
              placeholder="Mật khẩu"
              placeholderTextColor="#888"
              style={styles.input}
            />
            <Eye
              color="#888"
              size={22}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 10 }}>
            <Text style={{ color: "#7C3AED" }}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={["#7C3AED", "#6366F1"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Đăng nhập</Text>
              <ArrowRight color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>Hoặc tiếp tục với</Text>
            <View style={styles.line} />
          </View>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialLabel}>🔘 Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialLabel}>💻 GitHub</Text>
            </TouchableOpacity>
          </View>

          {/* Register */}
          <View style={styles.registerRow}>
            <Text style={{ color: "#666" }}>Chưa có tài khoản? </Text>
            <Text style={styles.registerLink}>Đăng ký miễn phí</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 18,
  },
  badgeText: { color: "#fff", fontSize: 13 },

  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  headingGradient: {
    color: "#FDE047", // vàng gradient
  },
  description: {
    color: "#E5E7EB",
    fontSize: 15,
    marginBottom: 25,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statNumber: { color: "#fff", fontWeight: "bold", fontSize: 18, marginTop: 6 },
  statLabel: { color: "#ddd", fontSize: 13 },

  loginCard: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 28,
    marginTop: 10,
  },

  loginTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111",
  },

  loginSubtitle: { color: "#777", marginBottom: 20 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    borderRadius: 12,
    height: 50,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },

  button: {
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  line: { flex: 1, height: 1, backgroundColor: "#ddd" },
  orText: { marginHorizontal: 10, color: "#777" },

  socialRow: { flexDirection: "row", justifyContent: "space-between" },

  socialButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },

  socialLabel: { fontSize: 15, color: "#444" },

  registerRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },

  registerLink: {
    color: "#7C3AED",
    fontWeight: "bold",
  },
});
