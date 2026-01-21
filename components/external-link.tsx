import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}

// import React, { useState } from 'react';
// import {
//   StyleSheet, Text, View, ScrollView, Image, 
//   TouchableOpacity, Dimensions, SafeAreaView, StatusBar, 
//   TextInput, Platform
// } from 'react-native';
// import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router'; // Cần thiết để điều hướng

// const { width } = Dimensions.get('window');

// export default function MeiPremiumStore() {
//   const router = useRouter();
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" />
      
//       {/* --- ELITE HEADER --- */}
//       <SafeAreaView style={styles.safeHeader}>
//         <View style={styles.header}>
//           {!isSearching ? (
//             // TRẠNG THÁI HIỂN THỊ LOGO BÌNH THƯỜNG
//             <>
//               <View style={styles.brandContainer}>
//                 <LinearGradient
//                   colors={['#1D1D1F', '#434343']}
//                   style={styles.logoBoxMei}
//                 >
//                   <Text style={styles.logoTextMei}>M</Text>
//                 </LinearGradient>
                
//                 <View style={styles.brandTextWrapper}>
//                   <Text style={styles.brandTitleMei}>
//                     MEI<Text style={{fontWeight: '300', color: '#8E8E93'}}> TECHNOLOGY</Text>
//                   </Text>
//                   <View style={styles.statusBadge}>
//                     <View style={styles.dotActive} />
//                     <Text style={styles.brandSubMei}>PREMIUM TECH EXPERIENCE</Text>
//                   </View>
//                 </View>
//               </View>

//               <View style={styles.headerRight}>
//                 <TouchableOpacity 
//                   style={styles.headerIcon} 
//                   onPress={() => setIsSearching(true)}
//                 >
//                   <Feather name="search" size={20} color="#1D1D1F" />
//                 </TouchableOpacity>
//                 <TouchableOpacity 
//                   style={styles.headerIcon} 
//                   onPress={() => router.push('/cart')} // Chuyển trang giỏ hàng
//                 >
//                   <Feather name="shopping-bag" size={20} color="#1D1D1F" />
//                   <View style={styles.cartDot} />
//                 </TouchableOpacity>
//               </View>
//             </>
//           ) : (
//             // TRẠNG THÁI THANH TÌM KIẾM ĐANG MỞ
//             <View style={styles.searchBarWrapper}>
//               <View style={styles.searchInputContainer}>
//                 <Feather name="search" size={18} color="#8E8E93" style={{marginLeft: 12}} />
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder="Tìm kiếm sản phẩm..."
//                   autoFocus
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                 />
//                 {searchQuery.length > 0 && (
//                   <TouchableOpacity onPress={() => setSearchQuery('')}>
//                     <Ionicons name="close-circle" size={18} color="#C7C7CC" style={{marginRight: 8}} />
//                   </TouchableOpacity>
//                 )}
//               </View>
//               <TouchableOpacity onPress={() => {setIsSearching(false); setSearchQuery('');}}>
//                 <Text style={styles.cancelText}>Hủy</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </SafeAreaView>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
//         {/* --- ARTISTIC HERO BANNER --- */}
//         <View style={styles.heroWrapper}>
//           <LinearGradient
//             colors={['#000', '#2C2C2E']}
//             start={{x: 0, y: 0}} end={{x: 1, y: 1}}
//             style={styles.heroCard}
//           >
//             <View style={styles.heroContent}>
//               <View style={styles.newTag}><Text style={styles.newTagText}>LIMITED EDITION</Text></View>
//               <Text style={styles.heroTitle}>MacBook Pro M5</Text>
//               <Text style={styles.heroSubTitle}>Sức mạnh thay đổi mọi thứ.</Text>
//               <TouchableOpacity style={styles.heroBtn}>
//                 <Text style={styles.heroBtnText}>Trải nghiệm ngay</Text>
//                 <Feather name="arrow-right" size={14} color="#000" />
//               </TouchableOpacity>
//             </View>
//             <Image 
//               source={{ uri: 'https://pngimg.com/uploads/macbook/macbook_PNG65.png' }} 
//               style={styles.heroImg}
//             />
//           </LinearGradient>
//         </View>

//         {/* --- MINIMAL CATEGORIES --- */}
//         <View style={styles.catWrapper}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
//             {[
//               {id: 1, name: 'iPhone', icon: 'cellphone', color: '#5856D6'},
//               {id: 2, name: 'Mac', icon: 'laptop', color: '#007AFF'},
//               {id: 3, name: 'Watch', icon: 'watch', color: '#FF9500'},
//               {id: 4, name: 'Audio', icon: 'headphones', color: '#FF2D55'}
//             ].map((cat) => (
//               <TouchableOpacity key={cat.id} style={styles.catItem}>
//                 <View style={[styles.catIconCircle, {borderColor: cat.color + '30'}]}>
//                   <MaterialCommunityIcons name={cat.icon} size={26} color="#1D1D1F" />
//                 </View>
//                 <Text style={styles.catName}>{cat.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         {/* --- LUXURY BENTO GRID --- */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionLabel}>SẢN PHẨM NỔI BẬT</Text>
//             <TouchableOpacity><Text style={styles.seeAll}>Tất cả</Text></TouchableOpacity>
//           </View>

//           <View style={styles.bentoContainer}>
//             <TouchableOpacity style={styles.bentoLarge}>
//               <Image 
//                 source={{ uri: 'https://vcdn1-sohoa.vnecdn.net/2023/09/13/iphone-15-pro-finish-select-202309-6-7714-1694564993.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=KAsG372E79B5wS-tYtFfLw' }} 
//                 style={styles.pImgLarge}
//               />
//               <View>
//                 <Text style={styles.pName}>iPhone 15 Pro Max</Text>
//                 <Text style={styles.pPrice}>32.990.000đ</Text>
//               </View>
//             </TouchableOpacity>

//             <View style={styles.bentoCol}>
//               <TouchableOpacity style={styles.bentoSmall}>
//                 <Image source={{ uri: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MTJV3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1694014871985' }} style={styles.pImgSmall} />
//                 <Text style={styles.pNameSmall}>AirPods Pro</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.bentoSmall}>
//                 <Image source={{ uri: 'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-s928-sm-s928bztqxxv-539305718?$650_519_PNG$' }} style={styles.pImgSmall} />
//                 <Text style={styles.pNameSmall}>S24 Ultra</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* --- NEW ARRIVAL LIST --- */}
//         <View style={[styles.section, {marginBottom: 30}]}>
//           <Text style={styles.sectionLabel}>SẢN PHẨM MỚI</Text>
//           <View style={styles.newList}>
//             {[1, 2].map((i) => (
//               <TouchableOpacity key={i} style={styles.newCard}>
//                 <View style={styles.row}>
//                   {/* <Image source={{ uri: 'https://images.samsung.com/is/image/samsung/p6pim/vn/sm-r390nzsaxxv/gallery/vn-galaxy-fit3-r390-sm-r390nzsaxxv-539829928' }} style={styles.newImg} /> */}
//                   <View style={styles.newInfo}>
//                     <Text style={styles.newBrand}>MEI SELECTION</Text>
//                     <Text style={styles.newName}>Galaxy Fit 3 Special</Text>
//                     <Text style={styles.newPrice}>1.290.000đ</Text>
//                   </View>
//                   <View style={styles.goBtn}>
//                     <Feather name="chevron-right" size={20} color="#8E8E93" />
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FBFBFD' },
//   safeHeader: { backgroundColor: '#fff' },
  
//   header: { 
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
//     paddingHorizontal: 20, paddingVertical: 10, height: 60
//   },
//   brandContainer: { flexDirection: 'row', alignItems: 'center' },
//   logoBoxMei: { 
//     width: 42, height: 42, borderRadius: 12, 
//     justifyContent: 'center', alignItems: 'center',
//     shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
//   },
//   logoTextMei: { 
//     color: '#fff', fontSize: 22, fontWeight: '300', 
//     fontFamily: Platform.OS === 'ios' ? 'Optima' : 'serif' 
//   },
//   brandTextWrapper: { marginLeft: 12 },
//   brandTitleMei: { fontSize: 18, fontWeight: '800', letterSpacing: 1.5, color: '#1D1D1F' },
//   statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
//   dotActive: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#34C759', marginRight: 5 },
//   brandSubMei: { fontSize: 8, color: '#8E8E93', fontWeight: 'bold', letterSpacing: 0.5 },
  
//   headerRight: { flexDirection: 'row', gap: 10 },
//   headerIcon: { 
//     width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2F2F7', 
//     justifyContent: 'center', alignItems: 'center' 
//   },
//   cartDot: { 
//     position: 'absolute', top: 10, right: 10, width: 7, height: 7, 
//     borderRadius: 4, backgroundColor: '#007AFF', borderWidth: 1.5, borderColor: '#fff' 
//   },

//   // Search Bar
//   searchBarWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
//   searchInputContainer: {
//     flex: 1, flexDirection: 'row', alignItems: 'center', 
//     backgroundColor: '#F2F2F7', borderRadius: 12, height: 40
//   },
//   searchInput: { flex: 1, fontSize: 15, paddingHorizontal: 10, color: '#000' },
//   cancelText: { color: '#007AFF', fontSize: 15, fontWeight: '600' },

//   scrollContent: { paddingBottom: 100 },

//   // Hero Section
//   heroWrapper: { padding: 20 },
//   heroCard: { 
//     height: 220, borderRadius: 24, padding: 25, 
//     flexDirection: 'row', overflow: 'hidden' 
//   },
//   heroContent: { flex: 1.2, justifyContent: 'center', zIndex: 1 },
//   newTag: { 
//     backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, 
//     paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' 
//   },
//   newTagText: { color: '#fff', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
//   heroTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 12 },
//   heroSubTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 },
//   heroBtn: { 
//     backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10, 
//     borderRadius: 10, alignSelf: 'flex-start', marginTop: 20,
//     flexDirection: 'row', alignItems: 'center', gap: 8
//   },
//   heroBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
//   heroImg: { width: 200, height: 200, position: 'absolute', right: -30, bottom: -20, resizeMode: 'contain' },

//   // Categories
//   catWrapper: { marginTop: 10 },
//   catScroll: { paddingLeft: 20, paddingBottom: 10 },
//   catItem: { alignItems: 'center', marginRight: 22 },
//   catIconCircle: { 
//     width: 64, height: 64, borderRadius: 22, backgroundColor: '#fff', 
//     justifyContent: 'center', alignItems: 'center',
//     borderWidth: 1, borderColor: '#F2F2F7'
//   },
//   catName: { fontSize: 11, fontWeight: '700', color: '#48484A', marginTop: 10 },

//   // Bento Grid
//   section: { marginTop: 35 },
//   sectionHeader: { 
//     flexDirection: 'row', justifyContent: 'space-between', 
//     alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 
//   },
//   sectionLabel: { fontSize: 12, fontWeight: '900', color: '#1D1D1F', letterSpacing: 1.2, paddingHorizontal: 20, marginBottom: 15 },
//   seeAll: { color: '#8E8E93', fontWeight: '700', fontSize: 12 },
//   bentoContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 15 },
//   bentoLarge: { 
//     flex: 1.2, height: 260, backgroundColor: '#fff', borderRadius: 24, 
//     padding: 20, justifyContent: 'space-between',
//     borderWidth: 1, borderColor: '#F2F2F7'
//   },
//   pImgLarge: { width: '100%', height: 150, resizeMode: 'contain' },
//   pName: { fontSize: 15, fontWeight: 'bold', color: '#1D1D1F' },
//   pPrice: { color: '#8E8E93', fontWeight: '600', fontSize: 13, marginTop: 2 },
//   bentoCol: { flex: 1, gap: 15 },
//   bentoSmall: { 
//     flex: 1, backgroundColor: '#fff', borderRadius: 24, 
//     padding: 15, alignItems: 'center', justifyContent: 'center',
//     borderWidth: 1, borderColor: '#F2F2F7'
//   },
//   pImgSmall: { width: '80%', height: 70, resizeMode: 'contain' },
//   pNameSmall: { fontSize: 11, fontWeight: 'bold', marginTop: 10, color: '#1D1D1F' },

//   // New List
//   newList: { paddingHorizontal: 20 },
//   newCard: { 
//     backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 12,
//     borderWidth: 1, borderColor: '#F2F2F7'
//   },
//   row: { flexDirection: 'row', alignItems: 'center' },
//   newImg: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#F9F9FB' },
//   newInfo: { flex: 1, marginLeft: 15 },
//   newBrand: { fontSize: 8, color: '#007AFF', fontWeight: '900', letterSpacing: 1 },
//   newName: { fontSize: 14, fontWeight: 'bold', color: '#1D1D1F', marginTop: 2 },
//   newPrice: { fontSize: 14, fontWeight: '600', color: '#48484A', marginTop: 4 },
//   goBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' }
// });