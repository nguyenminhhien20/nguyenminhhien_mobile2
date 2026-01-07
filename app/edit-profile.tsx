import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EditProfileClear() {
  const router = useRouter();
  const [name, setName] = useState('Alex Meiapp');
  const [phone, setPhone] = useState('0901 234 567');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      
      {/* Header: To, rõ, dễ bấm */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Khu vực ảnh đại diện */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.changePhotoBtn}>
              <Feather name="camera" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Các ô nhập liệu: Tách biệt rõ ràng */}
        <View style={styles.form}>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Họ và tên</Text>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nhập tên của bạn"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <View style={styles.inputContainer}>
              <Feather name="phone" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email (Không thể thay đổi)</Text>
            <View style={[styles.inputContainer, styles.disabledInput]}>
              <Feather name="mail" size={20} color="#999" style={styles.inputIcon} />
              <TextInput 
                style={[styles.input, { color: '#999' }]}
                value="alex.meiapp@gmail.com"
                editable={false}
              />
            </View>
          </View>

        </View>

        {/* Nút lưu to, rõ ràng, màu đen cực nổi trên nền trắng */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5F8' }, // Nút nền hơi xanh nhạt cho dịu mắt
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#FFF' },
  changePhotoBtn: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#000', width: 36, height: 36,
    borderRadius: 18, justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#FFF'
  },

  form: { marginBottom: 30 },
  inputWrapper: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 60,
    // Tạo bóng đổ cho ô nhập liệu nổi lên
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledInput: { backgroundColor: '#F8F8F8', elevation: 0, shadowOpacity: 0 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#000', fontWeight: '500' },

  saveButton: {
    backgroundColor: '#000',
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 50
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});