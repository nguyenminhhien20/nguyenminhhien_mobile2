import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

interface RegisterProps {
  onBackToLogin: () => void;
}

export default function MobileStoreRegister({ onBackToLogin }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [numphone, setNumphone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(translate, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirm || !numphone) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const newUser = { username, email, numphone, pass: password, photo: "" };

      const res = await fetch(API_CONFIG.USERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      res.ok
        ? Alert.alert("Thành công", "Tạo tài khoản thành công", [
            { text: "Đăng nhập", onPress: onBackToLogin },
          ])
        : Alert.alert("Thất bại", "Không thể tạo tài khoản");
    } catch {
      Alert.alert("Lỗi", "Không kết nối được máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* BACKGROUND */}
      <LinearGradient
        colors={["#020617", "#020617", "#0f172a"]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.glowBlue} />
      <View style={styles.glowPurple} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.card,
            { opacity, transform: [{ translateY: translate }] },
          ]}
        >
          {/* Back */}
          <Pressable onPress={onBackToLogin} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#a5b4fc" />
          </Pressable>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <Ionicons name="phone-portrait-outline" size={36} color="#6366f1" />
          </View>

          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>
            Gia nhập Mobile Store – mua sắm công nghệ
          </Text>

          {/* Inputs */}
          <GlassInput
            icon="account-outline"
            placeholder="Tên người dùng"
            value={username}
            onChangeText={setUsername}
          />

          <GlassInput
            icon="email-outline"
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <GlassInput
            icon="phone-outline"
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={numphone}
            onChangeText={setNumphone}
          />

          <GlassInput
            icon="lock-outline"
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <GlassInput
            icon="check-circle-outline"
            placeholder="Xác nhận mật khẩu"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          {/* Button */}
          <Pressable onPress={handleRegister} disabled={loading}>
            <LinearGradient
              colors={["#6366f1", "#2563eb"]}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đăng ký</Text>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable onPress={onBackToLogin} style={{ marginTop: 18 }}>
            <Text style={styles.footer}>
              Đã có tài khoản? <Text style={styles.link}>Đăng nhập</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ========== Glass Input ========== */
function GlassInput(props: any) {
  return (
    <View style={styles.input}>
      <MaterialCommunityIcons
        name={props.icon}
        size={20}
        color="#94a3b8"
      />
      <TextInput
        {...props}
        style={styles.text}
        placeholderTextColor="#64748b"
      />
    </View>
  );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  glowBlue: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#2563eb",
    opacity: 0.25,
    top: -120,
    left: -120,
  },

  glowPurple: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#6366f1",
    opacity: 0.25,
    bottom: -120,
    right: -120,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 32,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 40,
    elevation: 25,
  },

  backBtn: {
    position: "absolute",
    top: 18,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "rgba(99,102,241,0.15)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#fff",
  },

  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: 24,
    marginTop: 4,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginBottom: 14,
  },

  text: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },

  button: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
  },

  link: {
    color: "#818cf8",
    fontWeight: "700",
  },
});
