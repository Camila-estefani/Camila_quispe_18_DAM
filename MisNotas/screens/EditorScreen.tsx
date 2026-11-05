import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { insertNote, Note, openDatabase, updateNote } from '../database/db';
import type { SQLiteDatabase } from 'expo-sqlite';

type Props = {
  note: Note | null;
  onSave: () => void;
  onCancel: () => void;
};

const PALETTE = [
  '#FFF9C4',
  '#C8E6C9',
  '#BBDEFB',
  '#F8BBD0',
  '#E1BEE7',
  '#FFE0B2',
  '#B2DFDB',
  '#FFFFFF',
];

// ─── Galería integrada ───────────────────────────────────────────────────────
// Las dos que mandaste + 8 extra (paisajes y anime aesthetic)
type GalleryItem = { id: string; uri: string; label: string };

const GALLERY: GalleryItem[] = [
  // Tus imágenes de Pinterest
  {
    id: '1',
    uri: 'https://i.pinimg.com/736x/19/f6/7e/19f67e798ddb0929f9666586b3600988.jpg',
    label: 'Pinterest 1',
  },
  {
    id: '2',
    uri: 'https://i.pinimg.com/736x/f1/d8/6b/f1d86ba0409995abe2dc737ea23027fe.jpg',
    label: 'Pinterest 2',
  },
  // Paisajes — Unsplash (libres de uso)
  {
    id: '3',
    uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    label: 'Montaña',
  },
  {
    id: '4',
    uri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    label: 'Valle verde',
  },
  {
    id: '5',
    uri: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',
    label: 'Lago',
  },
  {
    id: '6',
    uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    label: 'Noche estrellada',
  },
  {
    id: '7',
    uri: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80',
    label: 'Cascada',
  },
  {
    id: '8',
    uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    label: 'Pico nevado',
  },
  // Anime / aesthetic — Picsum con seed fijo para resultado consistente
  {
    id: '9',
    uri: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
    label: 'Ciudad noche',
  },
  {
    id: '10',
    uri: 'https://images.unsplash.com/photo-1490750967868-88df5691cc33?w=600&q=80',
    label: 'Flores aesthetic',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function EditorScreen({ note, onSave, onCancel }: Props) {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [color, setColor] = useState(PALETTE[0]);
  const [imagen, setImagen] = useState<string | null>(null);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    openDatabase().then(setDb);
    if (note) {
      setTitulo(note.titulo);
      setContenido(note.contenido);
      setColor(note.color);
      setImagen(note.imagen ?? null);
    }
  }, [note]);

  // --- Galería del dispositivo ---
  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImagen(result.assets[0].uri);
  };

  // --- Explorador de archivos ---
  const pickFromFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.length) {
      setImagen(result.assets[0].uri);
    }
  };

  // --- Galería integrada ---
  const pickFromBuiltIn = (uri: string) => {
    setImagen(uri);
    setModalVisible(false);
  };

  const removeImage = () => setImagen(null);

  // --- Guardar ---
  const handleSave = async () => {
    if (!db) return;
    if (!titulo.trim()) {
      Alert.alert('Título requerido', 'Escribe un título para tu nota.');
      return;
    }
    if (note) {
      await updateNote(db, note.id, titulo.trim(), contenido.trim(), color, imagen);
    } else {
      await insertNote(db, titulo.trim(), contenido.trim(), color, imagen);
    }
    onSave();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: color }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{note ? 'Editar nota' : 'Nueva nota'}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {/* Paleta */}
        <View style={styles.paletteRow}>
          {PALETTE.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        {/* Inputs */}
        <TextInput
          style={styles.inputTitle}
          placeholder="Título de la nota"
          placeholderTextColor="#AAA"
          value={titulo}
          onChangeText={setTitulo}
          maxLength={60}
          returnKeyType="next"
        />
        <View style={styles.divider} />
        <TextInput
          style={styles.inputBody}
          placeholder="Escribe aquí tu nota..."
          placeholderTextColor="#AAA"
          value={contenido}
          onChangeText={setContenido}
          multiline
          textAlignVertical="top"
        />

        {/* ── Sección imagen ── */}
        <View style={styles.imageSection}>
          {imagen ? (
            // Preview de la imagen seleccionada
            <View>
              <Image source={{ uri: imagen }} style={styles.previewImage} resizeMode="cover" />
              <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
                <Text style={styles.removeImageText}>✕ Quitar foto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Tres botones de selección
            <View>
              <Text style={styles.sectionLabel}>📎 Agregar imagen</Text>

              {/* BOTÓN PRINCIPAL — galería integrada, siempre funciona */}
              <TouchableOpacity
                style={styles.pickMainBtn}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.pickMainIcon}>🖼️</Text>
                <View>
                  <Text style={styles.pickMainTitle}>Seleccionar imagen</Text>
                  <Text style={styles.pickMainSub}>Toca aquí para ver las imágenes disponibles</Text>
                </View>
              </TouchableOpacity>

              {/* Botones secundarios más pequeños */}
              <View style={styles.pickRow}>
                <TouchableOpacity style={[styles.pickBtn, styles.pickBtnTeal]} onPress={pickFromGallery} activeOpacity={0.8}>
                  <Text style={styles.pickBtnIcon}>📷</Text>
                  <Text style={[styles.pickBtnText, { color: '#00897B' }]}>Fotos del dispositivo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pickBtn, styles.pickBtnOrange]} onPress={pickFromFiles} activeOpacity={0.8}>
                  <Text style={styles.pickBtnIcon}>📁</Text>
                  <Text style={[styles.pickBtnText, { color: '#E65100' }]}>Mis archivos</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Modal galería integrada ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Elige una imagen</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={GALLERY}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.galleryGrid}
              columnWrapperStyle={{ gap: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.galleryThumbWrapper}
                  onPress={() => pickFromBuiltIn(item.uri)}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.galleryThumb}
                    resizeMode="cover"
                  />
                  <Text style={styles.galleryThumbLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  backBtn: { padding: 8, marginRight: 4 },
  backIcon: { fontSize: 22, color: '#333', fontWeight: '600' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#333', textAlign: 'center' },
  saveBtn: { backgroundColor: '#7C4DFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Body
  body: { padding: 20, paddingBottom: 60 },
  paletteRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 10, flexWrap: 'wrap' },
  colorDot: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: '#CCC' },
  colorDotSelected: { borderWidth: 3, borderColor: '#7C4DFF', transform: [{ scale: 1.2 }] },
  inputTitle: { fontSize: 22, fontWeight: '700', color: '#222', paddingVertical: 4, marginBottom: 8 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: 14 },
  inputBody: { fontSize: 15, color: '#333', lineHeight: 22, minHeight: 140 },

  // Imagen
  imageSection: { marginTop: 24 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 10 },

  // Botón principal grande
  pickMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#7C4DFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  pickMainIcon: { fontSize: 32 },
  pickMainTitle: { fontSize: 15, fontWeight: '800', color: '#fff' },
  pickMainSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Botones secundarios
  pickRow: { flexDirection: 'row', gap: 8 },
  pickBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
  },
  pickBtnPrimary: { backgroundColor: 'rgba(124,77,255,0.08)', borderColor: '#7C4DFF' },
  pickBtnTeal:    { backgroundColor: 'rgba(0,137,123,0.08)',  borderColor: '#00897B' },
  pickBtnOrange:  { backgroundColor: 'rgba(230,81,0,0.08)',   borderColor: '#E65100' },
  pickBtnIcon: { fontSize: 20 },
  pickBtnText: { fontSize: 10, fontWeight: '700', textAlign: 'center' },

  previewImage: { width: '100%', height: 220, borderRadius: 14 },
  removeImageBtn: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(200,0,0,0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  removeImageText: { color: '#C62828', fontWeight: '600', fontSize: 13 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#222' },
  modalClose: { fontSize: 18, color: '#888', padding: 4 },
  galleryGrid: { padding: 14 },
  galleryThumbWrapper: { flex: 1 },
  galleryThumb: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  galleryThumbLabel: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
});
