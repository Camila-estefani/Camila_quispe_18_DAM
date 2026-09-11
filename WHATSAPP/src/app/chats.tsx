// Pantalla 2: Lista de Chats (Pantalla Principal)
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CHATS = [
  {
    id: '1',
    name: 'María García',
    lastMessage: 'Hola! ¿Cómo estás? 😊',
    time: '10:32',
    unread: 3,
    avatar: 'MG',
    avatarColor: '#FF6B6B',
  },
  {
    id: '2',
    name: 'Carlos López',
    lastMessage: 'Te mando el documento ahora',
    time: '09:15',
    unread: 0,
    avatar: 'CL',
    avatarColor: '#4ECDC4',
  },
  {
    id: '3',
    name: 'Familia 🏠',
    lastMessage: 'Mamá: ¿Vienen a cenar?',
    time: 'Ayer',
    unread: 7,
    avatar: 'F',
    avatarColor: '#45B7D1',
  },
  {
    id: '4',
    name: 'Ana Martínez',
    lastMessage: 'Jajaja exacto 😂',
    time: 'Ayer',
    unread: 0,
    avatar: 'AM',
    avatarColor: '#96CEB4',
  },
  {
    id: '5',
    name: 'Trabajo - DAM',
    lastMessage: 'Profe: Entreguen la actividad',
    time: 'Lun',
    unread: 2,
    avatar: 'T',
    avatarColor: '#FFEAA7',
  },
  {
    id: '6',
    name: 'Pedro Sánchez',
    lastMessage: 'Ok, hasta luego!',
    time: 'Lun',
    unread: 0,
    avatar: 'PS',
    avatarColor: '#DDA0DD',
  },
  {
    id: '7',
    name: 'Laura Torres',
    lastMessage: '📷 Foto',
    time: 'Dom',
    unread: 1,
    avatar: 'LT',
    avatarColor: '#F0A500',
  },
  {
    id: '8',
    name: 'Amigos 🎉',
    lastMessage: 'Juan: ¿Para el sábado?',
    time: 'Dom',
    unread: 0,
    avatar: 'A',
    avatarColor: '#6C5CE7',
  },
];

export default function ChatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function handleChatPress(chat: typeof CHATS[0]) {
    router.push(`/chat/${chat.id}`);
  }

  function handleLogout() {
    router.replace('/');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WhatsApp</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <View style={styles.tabActive}>
          <Text style={styles.tabActiveText}>CHATS</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>ESTADOS</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>LLAMADAS</Text>
        </View>
      </View>

      {/* Lista de chats */}
      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => handleChatPress(item)}
            activeOpacity={0.7}
          >
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
              <Text style={styles.avatarText}>{item.avatar}</Text>
            </View>

            {/* Contenido */}
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.chatTime,
                    item.unread > 0 && styles.chatTimeUnread,
                  ]}
                >
                  {item.time}
                </Text>
              </View>
              <View style={styles.chatFooter}>
                <Text style={styles.chatLastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 16 }]}>
        <Text style={styles.fabIcon}>💬</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#075E54',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  tabs: {
    backgroundColor: '#075E54',
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#25D366',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabActiveText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 80,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
    gap: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 8,
  },
  chatTimeUnread: {
    color: '#25D366',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#888',
    flex: 1,
  },
  badge: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabIcon: {
    fontSize: 26,
  },
});
