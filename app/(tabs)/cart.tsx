import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, 
  TouchableOpacity, StatusBar, Platform
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  color: string;
};

const SAMPLE_CART: CartItem[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 34990000,
    qty: 1,
    color: "Titanium Black",
    image: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
  },
  {
    id: "2",
    name: "Apple Watch Ultra 2",
    price: 21490000,
    qty: 1,
    color: "Ocean Band",
    image: "https://cdn.tgdd.vn/Products/Images/7077/314831/apple-watch-ultra-2-49mm-vien-titanium-day-ocean-thumb-1-600x600.jpg",
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>(SAMPLE_CART);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header tinh tế */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <View style={styles.itemCountBadge}>
          <Text style={styles.itemCountText}>{cartItems.length} Món</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartCard}>
            <Image source={{ uri: item.image }} style={styles.itemImg} />
            
            <View style={styles.itemInfo}>
              <View>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.color}</Text>
              </View>
              
              <Text style={styles.itemPrice}>{item.price.toLocaleString()}₫</Text>
              
              <View style={styles.bottomRow}>
                <View style={styles.qtySelector}>
                  <TouchableOpacity style={styles.qtyBtn}>
                    <Feather name="minus" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <TouchableOpacity style={styles.qtyBtn}>
                    <Feather name="plus" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity>
                  <Feather name="trash-2" size={18} color="#444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Tổng kết thanh toán */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{totalPrice.toLocaleString()}₫</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>Miễn phí</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{totalPrice.toLocaleString()}₫</Text>
          </View>
        </View>

        {/* Nút thanh toán Trắng tinh khiết */}
        <TouchableOpacity activeOpacity={0.9} style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Thanh toán ngay</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </TouchableOpacity>

        {/* Khoảng trống để không bị Tab Bar trắng che */}
        <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  header: { 
    paddingTop: 70, 
    paddingHorizontal: 25, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20 
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: '#FFF',
    letterSpacing: -1
  },
  itemCountBadge: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  itemCountText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600'
  },
  scrollContent: { 
    paddingHorizontal: 20 
  },
  cartCard: { 
    flexDirection: 'row', 
    backgroundColor: '#0A0A0A', 
    borderRadius: 24, 
    padding: 15, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#151515'
  },
  itemImg: { 
    width: 100, 
    height: 100, 
    borderRadius: 18,
    backgroundColor: '#111'
  },
  itemInfo: { 
    flex: 1, 
    marginLeft: 18, 
    justifyContent: 'space-between' 
  },
  itemName: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#FFF' 
  },
  itemSub: {
    fontSize: 13,
    color: '#555',
    marginTop: 2
  },
  itemPrice: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#FFF', 
    marginTop: 8 
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 10,
    padding: 4
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyText: {
    color: '#FFF',
    paddingHorizontal: 12,
    fontWeight: '600'
  },
  summaryContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#0A0A0A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#151515'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  summaryLabel: {
    color: '#555',
    fontSize: 15
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500'
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#151515'
  },
  totalLabel: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700'
  },
  totalValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800'
  },
  checkoutBtn: { 
    marginTop: 25,
    height: 65, 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      }
    })
  },
  checkoutText: { 
    color: '#000', 
    fontSize: 17, 
    fontWeight: '700' 
  }
});