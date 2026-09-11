// Pantalla 3: Detalle del Chat
import { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Datos de los chats (coincide con el id de chats.tsx)
const CHAT_DATA: Record<string, { name: string; avatar: string; avatarColor: string }> = {
  '1': { name: 'María García', avatar: 'MG', avatarColor: '#FF6B6B' },
  '2': { name: 'Carlos López', avatar: 'CL', avatarColor: '#4ECDC4' },
  '3': { name: 'Familia 🏠', avatar: 'F', avatarColor: '#45B7D1' },
  '4': { name: 'Ana Martínez', avatar: 'AM', avatarColor: '#96CEB4' },
  '5': { name: 'Trabajo - DAM', avatar: 'T', avatarColor: '#FFEAA7' },
  '6': { name: 'Pedro Sánchez', avatar: 'PS', avatarColor: '#DDA0DD' },
  '7': { name: 'Laura Torres', avatar: 'LT', avatarColor: '#F0A500' },
  '8': { name: 'Amigos 🎉', avatar: 'A', avatarColor: '#6C5CE7' },
};

type Message = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
};

const INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Hola! ¿Cómo estás? 😊', fromMe: false, time: '10:30' },
    { id: '2', text: 'Todo bien, ¿y tú?', fromMe: true, time: '10:31' },
    { id: '3', text: 'Muy bien gracias! ¿Para el proyecto?', fromMe: false, time: '10:32' },
  ],
  '2': [
    { id: '1', text: 'Oye, ¿tienes el documento?', fromMe: true, time: '09:10' },
    { id: '2', text: 'Sí, te mando el documento ahora', fromMe: false, time: '09:15' },
  ],
  '3': [
    { id: '1', text: '¿Vienen a cenar esta noche?', fromMe: false, time: 'Ayer' },
    { id: '2', text: 'Yo sí puedo ir 🙋', fromMe: true, time: 'Ayer' },
  ],
  '5': [
    { id: '1', text: 'Entreguen la actividad antes del viernes', fromMe: false, time: 'Lun' },
    { id: '2', text: 'Ok profe! 👍', fromMe: true, time: 'Lun' },
  ],
};

function getTime() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const chatInfo = CHAT_DATA[id] ?? {
    name: 'Chat',
    avatar: '?',
    avatarColor: '#ccc',
  };

  const [messages, setMessages] = useState<Message[]>(
    INITIAL_MESSAGES[id] ?? []
  );
  const [inputText, setInputText] = useState('');
  const listRef = useRef<FlatList>(null);

  function sendMessage() {
    const text = inputText.trim();
    if (!text) return;

    const newMsg: Message = {
      id: String(Date.now()),
      text,
      fromMe: true,
      time: getTime(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simula respuesta automática
    setTimeout(() => {
      const reply: Message = {
        id: String(Date.now() + 1),
        text: getAutoReply(text),
        fromMe: false,
        time: getTime(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  }

  function getAutoReply(msg: string): string {
    const replies = [
      '😊 Entendido!',
      'Claro, con gusto!',
      'Jajaja sí 😂',
      'Ok, te aviso luego',
      '👍',
      'Qué buena idea!',
      'Sí, estoy de acuerdo',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />

      {/* Header personalizado */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={[styles.headerAvatar, { backgroundColor: chatInfo.avatarColor }]}>
          <Text style={styles.headerAvatarText}>{chatInfo.avatar}</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chatInfo.name}</Text>
          <Text style={styles.headerStatus}>en línea</Text>
        </View>

        <View style={styles.headerActions}>
          <Text style={styles.headerIcon}>📞</Text>
          <Text style={styles.headerIcon}>⋮</Text>
        </View>
      </View>

      {/* Fondo de chat con patrón */}
      <View style={styles.chatBackground}>
        {/* Mensajes */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                🔒 Los mensajes están cifrados de extremo a extremo
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.fromMe ? styles.bubbleMe : styles.bubbleOther,
              ]}
            >
              <Text style={[styles.messageText, item.fromMe && styles.messageTextMe]}>
                {item.text}
              </Text>
              <View style={styles.messageFooter}>
                <Text style={[styles.messageTime, item.fromMe && styles.messageTimeMe]}>
                  {item.time}
                </Text>
                {item.fromMe && (
                  <Text style={styles.checkmarks}>✓✓</Text>
                )}
              </View>
            </View>
          )}
        />
      </View>

      {/* Input de mensaje */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.emojiBtn}>
          <Text style={styles.emojiIcon}>😊</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Mensaje"
          placeholderTextColor="#aaa"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />

        <TouchableOpacity style={styles.attachBtn}>
          <Text style={styles.attachIcon}>📎</Text>
        </TouchableOpacity>

        {inputText.trim() ? (
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.sendIcon}>🎤</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#075E54',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  backBtn: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  backIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    fontSize: 22,
  },
  chatBackground: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  messagesList: {
    padding: 16,
    gap: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 32,
  },
  emptyText: {
    backgroundColor: '#FFF9C4',
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    marginBottom: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bubbleOther: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  bubbleMe: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  messageText: {
    fontSize: 15,
    color: '#111',
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#111',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 2,
  },
  messageTime: {
    fontSize: 11,
    color: '#aaa',
  },
  messageTimeMe: {
    color: '#888',
  },
  checkmarks: {
    fontSize: 11,
    color: '#4FC3F7',
  },
  inputBar: {
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 8,
  },
  emojiBtn: {
    paddingBottom: 8,
  },
  emojiIcon: {
    fontSize: 26,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111',
    maxHeight: 120,
    elevation: 1,
  },
  attachBtn: {
    paddingBottom: 8,
  },
  attachIcon: {
    fontSize: 24,
  },
  sendBtn: {
    backgroundColor: '#25D366',
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  sendIcon: {
    fontSize: 20,
    color: '#fff',
  },
});
