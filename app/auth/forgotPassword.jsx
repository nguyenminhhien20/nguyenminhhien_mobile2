import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email của bạn");
      return;
    }
    Alert.alert("Thành công", "Liên kết đặt mật khẩu đã được gửi vào email!");
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Image
          source={{ uri: "https://i.imgur.com/7YUJ9MG.png" }}
          style={styles.image}
        />
        <Text style={styles.title}>Quên mật khẩu?</Text>
        <Text style={styles.subtitle}>
          Nhập email đã đăng ký tài khoản để khôi phục mật khẩu.
        </Text>
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={22} color="#7C3AED" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleSend}>
        <Text style={styles.buttonText}>Gửi liên kết khôi phục</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={styles.back}>← Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==================== STYLE ===================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    justifyContent: "center",
  },

  image: { width: 120, height: 120, marginBottom: 15 },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 6,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#C4B5FD",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 20,
  },

  input: { flex: 1, fontSize: 16, color: "#333" },

  button: {
    backgroundColor: "#7C3AED",
    height: 55,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },

  back: { textAlign: "center", color: "#7C3AED", fontSize: 16, fontWeight: "600" },
});
