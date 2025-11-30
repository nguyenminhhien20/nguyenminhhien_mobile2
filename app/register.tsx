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
import { Mail, Lock, User, Eye, ArrowRight } from "lucide-react-native";

export default function RegisterScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <LinearGradient
      colors={["#6D28D9", "#7C3AED", "#2563EB"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>

        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✨ Tạo tài khoản miễn phí</Text>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>
          Chào mừng{" "}
          <Text style={styles.headingHighlight}>bạn mới!</Text>
        </Text>

        <Text style={styles.description}>
          Đăng ký tài khoản để bắt đầu hành trình của bạn.
        </Text>

        {/* Register Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Đăng ký</Text>
          <Text style={styles.cardSubtitle}>Điền thông tin bên dưới để tạo tài khoản.</Text>

          {/* Name */}
          <View style={styles.inputWrapper}>
            <User color="#7C3AED" size={20} />
            <TextInput
              placeholder="Họ và tên"
              placeholderTextColor="#888"
              style={styles.input}
            />
          </View>

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

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Lock color="#7C3AED" size={20} />
            <TextInput
              secureTextEntry={!confirmVisible}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#888"
              style={styles.input}
            />
            <Eye
              color="#888"
              size={22}
              onPress={() => setConfirmVisible(!confirmVisible)}
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={["#7C3AED", "#6366F1"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Đăng ký</Text>
              <ArrowRight color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>Hoặc</Text>
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

          {/* Navigate to Login */}
          <View style={styles.loginRow}>
            <Text style={{ color: "#555" }}>Đã có tài khoản? </Text>
            <Text style={styles.loginLink}>Đăng nhập</Text>
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
    backgroundColor: "rgba(255,255,255,0.25)",
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
  headingHighlight: {
    color: "#FDE047",
  },
  description: {
    color: "#E5E7EB",
    fontSize: 15,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 28,
    marginTop: 10,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111",
  },

  cardSubtitle: { color: "#777", marginBottom: 20 },

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

  loginRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },

  loginLink: {
    color: "#7C3AED",
    fontWeight: "bold",
  },
});
