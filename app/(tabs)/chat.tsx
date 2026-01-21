import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

// ⚠️ Đổi IP theo máy backend của bạn
const API_ENDPOINT = 'http://10.18.12.145:5025/api/chat';

const INIT_MESSAGE: Message = {
  id: 'init',
  text: 'Xin chào 👋 Tôi có thể giúp gì cho bạn?',
  sender: 'bot',
};

export default function WhiteChatbox() {
  const [messages, setMessages] = useState<Message[]>([INIT_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();

    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data?.reply || 'Xin lỗi, mình chưa hiểu câu hỏi 😥',
        sender: 'bot',
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: '❌ Không kết nối được server. Vui lòng kiểm tra backend.',
          sender: 'bot',
        },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.msgRow,
        item.sender === 'user' ? styles.userRow : styles.botRow,
      ]}
    >
      {item.sender === 'bot' && (
        <View style={styles.botIcon}>
          <Ionicons name="sparkles" size={14} color="#555" />
        </View>
      )}

      <View
        style={[
          styles.bubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.msgText,
            item.sender === 'user' ? styles.userText : styles.botText,
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <TouchableOpacity
          onPress={() => setMessages([INIT_MESSAGE])}
          style={styles.refreshBtn}
        >
          <Feather name="rotate-ccw" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      {/* CHAT LIST */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
      />

      {/* TYPING */}
      {isLoading && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#999" />
          <Text style={styles.typingText}>AI đang suy nghĩ...</Text>
        </View>
      )}

      {/* INPUT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#A1A1A1"
              value={input}
              onChangeText={setInput}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!input.trim() || isLoading) && styles.sendBtnDisabled,
              ]}
              onPress={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Feather name="arrow-up" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  refreshBtn: {
    padding: 6,
  },

  listContent: {
    padding: 16,
    paddingBottom: 20,
  },

  msgRow: {
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },

  botIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },

  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  botBubble: {
    backgroundColor: '#F2F2F7',
  },

  msgText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFF',
    fontWeight: '500',
  },
  botText: {
    color: '#1D1D1F',
  },

  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 10,
  },
  typingText: {
    marginLeft: 8,
    color: '#999',
    fontSize: 13,
  },

  inputBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
    backgroundColor: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 30,
    paddingLeft: 18,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#E5E5EA',
  },
});
