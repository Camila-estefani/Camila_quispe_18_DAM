import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { deleteNote, getAllNotes, Note, openDatabase } from '../database/db';
import type { SQLiteDatabase } from 'expo-sqlite';

type Props = {
  onOpenNote: (note: Note | null) => void;
};

function NoteCard({
  note,
  onEdit,
  onDelete,
}: {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.card, { backgroundColor: note.color, transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onEdit}
        style={styles.cardTouchable}
      >
        {note.imagen ? (
          <Image
            source={{ uri: note.imagen }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : null}
        <Text style={styles.cardTitle} numberOfLines={1}>
          {note.titulo}
        </Text>
        <Text style={styles.cardBody} numberOfLines={note.imagen ? 1 : 3}>
          {note.contenido}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardDate}>{note.fecha}</Text>
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.deleteIcon}>🗑</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ onOpenNote }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  const loadNotes = useCallback(async (database: SQLiteDatabase) => {
    const data = await getAllNotes(database);
    setNotes(data);
  }, []);

  useEffect(() => {
    openDatabase().then((database) => {
      setDb(database);
      loadNotes(database);
    });
  }, [loadNotes]);

  const handleDelete = async (id: number) => {
    if (!db) return;
    await deleteNote(db, id);
    await loadNotes(db);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📝 Mis Notas</Text>
        <Text style={styles.headerSubtitle}>{notes.length} nota{notes.length !== 1 ? 's' : ''}</Text>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🗒️</Text>
          <Text style={styles.emptyText}>No tienes notas aún</Text>
          <Text style={styles.emptyHint}>Toca el botón + para crear tu primera nota</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onEdit={() => onOpenNote(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => onOpenNote(null)} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#7C4DFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#D1C4E9',
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    maxWidth: '47%',
  },
  cardTouchable: {
    padding: 14,
    minHeight: 130,
    justifyContent: 'space-between',
  },
  cardImage: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cardDate: {
    fontSize: 11,
    color: '#888',
  },
  deleteIcon: {
    fontSize: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#555',
  },
  emptyHint: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 32,
  },
});
