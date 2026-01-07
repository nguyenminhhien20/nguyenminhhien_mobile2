import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Khám phá</Text>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#666" />
          <TextInput placeholder="Tìm kiếm sản phẩm..." placeholderTextColor="#666" style={styles.input} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { paddingTop: 60, paddingHorizontal: 25 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#151515', borderRadius: 15, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#222' },
  input: { flex: 1, marginLeft: 10, color: '#FFF' },
});