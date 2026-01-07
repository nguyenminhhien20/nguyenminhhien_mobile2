import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Animated,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// const CATEGORIES = [
//   { id: "1", title: "Bảo mật", icon: "lock", bgColor: "#E8ECFF" },
//   { id: "2", title: "Nhanh chóng", icon: "flash-on", bgColor: "#FFF4D6" },
//   { id: "3", title: "Hỗ trợ 24/7", icon: "support-agent", bgColor: "#E7FFE8" },
//   { id: "4", title: "Đa tính năng", icon: "star", bgColor: "#FFE7E7" },
// ];

// const HIGHLIGHTS = [
//   {
//     id: "1",
//     title: "Giao diện trực quan & mượt mà",
//     image:
//       "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?auto=format&fit=crop&w=800&q=80",
//   },
//   {
//     id: "2",
//     title: "Công nghệ bảo mật hiện đại",
//     image:
//       "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80",
//   },
//   {
//     id: "3",
//     title: "Trải nghiệm nhanh & ổn định",
//     image:
//       "https://images.unsplash.com/photo-1557683450-7e4d3f11e05b?auto=format&fit=crop&w=800&q=80",
//   },
// ];

// export default function HomeScreen() {
//   const router = useRouter();
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [cartCount, setCartCount] = useState(3);

//   const scrollY = new Animated.Value(0);

//   return (
//     <View style={styles.container}>
//       <Animated.ScrollView
//         contentContainerStyle={styles.content}
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: false }
//         )}
//       >
//         {/* HERO */}
//         <View style={styles.hero}>
//           <Image
//             source={{
//               uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=90",
//             }}
//             style={styles.heroImage}
//           />
//           <View style={styles.heroGradient} />
//           <View style={styles.heroOverlay}>
//             <Text style={styles.heroTitle}>Trải nghiệm mượt mà</Text>
//             <Text style={styles.heroSubtitle}>Nhanh • An toàn • Hiện đại</Text>
//             <TouchableOpacity
//               style={styles.ctaButton}
//               onPress={() => router.push("/register")}
//             >
//               <Text style={styles.ctaText}>Bắt đầu ngay</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* CATEGORIES */}
//         <Text style={styles.sectionTitle}>Danh mục</Text>
//         <View style={styles.categories}>
//           {CATEGORIES.map((cat) => (
//             <TouchableOpacity
//               key={cat.id}
//               style={[styles.categoryCard, { backgroundColor: cat.bgColor }]}
//             >
//               <MaterialIcons name={cat.icon} size={28} color="#4f46e5" />
//               <Text style={styles.categoryTitle}>{cat.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* HIGHLIGHTS */}
//         <Text style={styles.sectionTitle}>Điểm nổi bật</Text>
//         <FlatList
//           horizontal
//           data={HIGHLIGHTS}
//           keyExtractor={(item) => item.id}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingLeft: 20 }}
//           renderItem={({ item }) => (
//             <View style={styles.highlightCard}>
//               <Image source={{ uri: item.image }} style={styles.highlightImage} />
//               <Text style={styles.highlightTitle}>{item.title}</Text>
//             </View>
//           )}
//         />

//         {/* BOTTOM CTA */}
//         <TouchableOpacity
//           style={styles.bottomButton}
//           onPress={() => router.push("/register")}
//         >
//           <Text style={styles.bottomButtonText}>Tham gia ngay</Text>
//         </TouchableOpacity>
//       </Animated.ScrollView>

//       {/* FLOATING BUTTONS */}
//       <View style={styles.floatingButtons}>
//         <TouchableOpacity
//           style={styles.floatingIcon}
//           onPress={() => setMenuVisible(!menuVisible)}
//         >
//           <Ionicons name="person-circle-outline" size={50} color="#4f46e5" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.floatingIcon}
//           onPress={() => router.push("/cart")}
//         >
//           <Ionicons name="cart-outline" size={40} color="#4f46e5" />
//           {cartCount > 0 && (
//             <View style={styles.cartBadge}>
//               <Text style={styles.cartBadgeText}>{cartCount}</Text>
//             </View>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.floatingIcon}
//           onPress={() => router.push("/notifications")}
//         >
//           <Ionicons name="notifications-outline" size={40} color="#4f46e5" />
//         </TouchableOpacity>
//       </View>

//       {/* PROFILE MENU */}
//       {menuVisible && (
//         <View style={styles.userMenu}>
//           <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/profile")}>
//             <Text style={styles.menuText}>Trang cá nhân</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/login")}>
//             <Text style={styles.menuText}>Đăng nhập</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/register")}>
//             <Text style={styles.menuText}>Đăng ký</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f0f4f8" },
//   content: { paddingBottom: 100 },

//   hero: { width: "100%", height: 350, marginBottom: 30, borderRadius: 20, overflow: "hidden" },
//   heroImage: { width: "100%", height: "100%" },
//   heroGradient: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.25)",
//   },
//   heroOverlay: { position: "absolute", bottom: 30, left: 25 },
//   heroTitle: { color: "#fff", fontSize: 34, fontWeight: "900", marginBottom: 6 },
//   heroSubtitle: { color: "#eee", fontSize: 18, marginBottom: 16 },
//   ctaButton: {
//     backgroundColor: "#6366f1",
//     paddingVertical: 14,
//     paddingHorizontal: 26,
//     borderRadius: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   ctaText: { color: "#fff", fontWeight: "700", fontSize: 17 },

//   sectionTitle: { fontSize: 22, fontWeight: "800", color: "#1f2937", marginLeft: 20, marginBottom: 16 },

//   categories: { flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap", marginBottom: 30 },
//   categoryCard: {
//     width: "44%",
//     paddingVertical: 22,
//     borderRadius: 24,
//     alignItems: "center",
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   categoryTitle: { fontSize: 16, fontWeight: "700", textAlign: "center", color: "#1f2937" },

//   highlightCard: {
//     width: 260,
//     marginRight: 16,
//     borderRadius: 20,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     overflow: "hidden",
//   },
//   highlightImage: { width: "100%", height: 150 },
//   highlightTitle: { fontSize: 15, fontWeight: "600", padding: 10, color: "#1f2937" },

//   bottomButton: {
//     backgroundColor: "#6366f1",
//     marginHorizontal: 20,
//     paddingVertical: 16,
//     borderRadius: 22,
//     alignItems: "center",
//     marginTop: 30,
//     shadowColor: "#000",
//     shadowOpacity: 0.25,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 6 },
//   },
//   bottomButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },

//   floatingButtons: {
//     position: "absolute",
//     top: 60,
//     right: 20,
//     alignItems: "center",
//     justifyContent: "space-between",
//     height: 180,
//   },
//   floatingIcon: {
//     marginVertical: 10,
//     backgroundColor: "#fff",
//     padding: 6,
//     borderRadius: 50,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//   },

//   cartBadge: {
//     position: "absolute",
//     top: -5,
//     right: -5,
//     backgroundColor: "#f43f5e",
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cartBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },

//   userMenu: {
//     position: "absolute",
//     top: 120,
//     right: 20,
//     width: 180,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     paddingVertical: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 6 },
//     zIndex: 50,
//   },
//   menuItem: { paddingVertical: 14, paddingHorizontal: 18 },
//   menuText: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
// });