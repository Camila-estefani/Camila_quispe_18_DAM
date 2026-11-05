import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type PermStatus = 'undetermined' | 'granted' | 'denied';

type PermissionItem = {
  id: string;
  label: string;
  description: string;
  icon: string;
  status: PermStatus;
};

type Props = {
  onGoToLocation: () => void;
};

// ─── Colores por estado ───────────────────────────────────────────────────────
const STATUS_COLOR: Record<PermStatus, string> = {
  undetermined: '#9E9E9E',
  granted: '#43A047',
  denied: '#E53935',
};

const STATUS_LABEL: Record<PermStatus, string> = {
  undetermined: 'Sin solicitar',
  granted: '✓ Concedido',
  denied: '✗ Denegado',
};

const STATUS_BG: Record<PermStatus, string> = {
  undetermined: '#F5F5F5',
  granted: '#E8F5E9',
  denied: '#FFEBEE',
};

export default function PermissionsScreen({ onGoToLocation }: Props) {
  const [permisos, setPermisos] = useState<PermissionItem[]>([
    {
      id: 'location',
      label: 'Ubicación',
      description: 'Permite conocer tu posición GPS para mostrar el clima de tu ciudad.',
      icon: '📍',
      status: 'undetermined',
    },
    {
      id: 'camera',
      label: 'Cámara',
      description: 'Permite acceder a la cámara del dispositivo para tomar fotos.',
      icon: '📷',
      status: 'undetermined',
    },
    {
      id: 'microphone',
      label: 'Micrófono',
      description: 'Permite grabar audio desde el micrófono del dispositivo.',
      icon: '🎙️',
      status: 'undetermined',
    },
  ]);

  // Verificar estados al montar
  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    const [locPerm, camPerm, micPerm] = await Promise.all([
      Location.getForegroundPermissionsAsync(),
      Camera.getCameraPermissionsAsync(),
      Camera.getMicrophonePermissionsAsync(),
    ]);

    setPermisos((prev) =>
      prev.map((p) => {
        if (p.id === 'location') return { ...p, status: mapStatus(locPerm.status) };
        if (p.id === 'camera')   return { ...p, status: mapStatus(camPerm.status) };
        if (p.id === 'microphone') return { ...p, status: mapStatus(micPerm.status) };
        return p;
      })
    );
  };

  const mapStatus = (s: string): PermStatus => {
    if (s === 'granted') return 'granted';
    if (s === 'denied')  return 'denied';
    return 'undetermined';
  };

  // Solicitar permiso individual
  const requestPermission = async (id: string) => {
    let newStatus: PermStatus = 'denied';

    if (id === 'location') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      newStatus = mapStatus(status);
    } else if (id === 'camera') {
      const { status } = await Camera.requestCameraPermissionsAsync();
      newStatus = mapStatus(status);
    } else if (id === 'microphone') {
      const { status } = await Camera.requestMicrophonePermissionsAsync();
      newStatus = mapStatus(status);
    }

    setPermisos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    if (newStatus === 'denied') {
      Alert.alert(
        'Permiso denegado',
        'Puedes habilitarlo manualmente desde Ajustes del dispositivo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  // Solicitar todos de una vez
  const requestAll = async () => {
    for (const p of permisos) {
      if (p.status !== 'granted') {
        await requestPermission(p.id);
      }
    }
  };

  const allGranted = permisos.every((p) => p.status === 'granted');
  const anyGranted = permisos.some((p) => p.status === 'granted');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔐 Permisos</Text>
        <Text style={styles.headerSub}>Gestiona los accesos de la aplicación</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Resumen visual */}
        <View style={styles.summaryRow}>
          {permisos.map((p) => (
            <View key={p.id} style={[styles.summaryDot, { backgroundColor: STATUS_COLOR[p.status] }]}>
              <Text style={styles.summaryDotIcon}>{p.icon}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.summaryText}>
          {allGranted
            ? '¡Todos los permisos están activos!'
            : `${permisos.filter((p) => p.status === 'granted').length} de ${permisos.length} permisos concedidos`}
        </Text>

        {/* Tarjetas de permisos */}
        {permisos.map((p) => (
          <View key={p.id} style={[styles.card, { backgroundColor: STATUS_BG[p.status] }]}>
            <View style={styles.cardTop}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardIcon}>{p.icon}</Text>
                <View>
                  <Text style={styles.cardLabel}>{p.label}</Text>
                  <Text style={[styles.cardStatus, { color: STATUS_COLOR[p.status] }]}>
                    {STATUS_LABEL[p.status]}
                  </Text>
                </View>
              </View>

              {/* Botón acción */}
              {p.status === 'granted' ? (
                <View style={styles.grantedBadge}>
                  <Text style={styles.grantedBadgeText}>Activo</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.requestBtn, p.status === 'denied' && styles.requestBtnDenied]}
                  onPress={() => requestPermission(p.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.requestBtnText}>
                    {p.status === 'denied' ? 'Reintentar' : 'Solicitar'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.cardDesc}>{p.description}</Text>

            {/* Barra de estado */}
            <View style={styles.statusBar}>
              <View
                style={[
                  styles.statusBarFill,
                  {
                    backgroundColor: STATUS_COLOR[p.status],
                    width: p.status === 'granted' ? '100%' : p.status === 'denied' ? '50%' : '10%',
                  },
                ]}
              />
            </View>
          </View>
        ))}

        {/* Botón solicitar todos */}
        {!allGranted && (
          <TouchableOpacity style={styles.allBtn} onPress={requestAll} activeOpacity={0.85}>
            <Text style={styles.allBtnText}>🔓 Solicitar todos los permisos</Text>
          </TouchableOpacity>
        )}

        {/* Botón ir a ubicación */}
        {anyGranted && (
          <TouchableOpacity style={styles.locationBtn} onPress={onGoToLocation} activeOpacity={0.85}>
            <Text style={styles.locationBtnText}>📍 Ver mi ubicación</Text>
          </TouchableOpacity>
        )}

        {/* Nota */}
        <View style={styles.note}>
          <Text style={styles.noteText}>
            ℹ️ Si denegaste un permiso, puedes habilitarlo desde{' '}
            <Text style={styles.noteLink} onPress={() => Linking.openSettings()}>
              Ajustes del dispositivo
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },

  header: {
    backgroundColor: '#3949AB',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: '#C5CAE9', marginTop: 4 },

  body: { padding: 20, paddingBottom: 50 },

  summaryRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 8 },
  summaryDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryDotIcon: { fontSize: 22 },
  summaryText: { textAlign: 'center', fontSize: 13, color: '#666', marginBottom: 20 },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cardIcon: { fontSize: 30 },
  cardLabel: { fontSize: 16, fontWeight: '700', color: '#222' },
  cardStatus: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  cardDesc: { fontSize: 12, color: '#666', lineHeight: 18, marginBottom: 10 },

  grantedBadge: {
    backgroundColor: '#43A047',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  grantedBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  requestBtn: {
    backgroundColor: '#3949AB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  requestBtnDenied: { backgroundColor: '#E53935' },
  requestBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  statusBar: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, overflow: 'hidden' },
  statusBarFill: { height: '100%', borderRadius: 2 },

  allBtn: {
    backgroundColor: '#3949AB',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#3949AB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  allBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  locationBtn: {
    backgroundColor: '#00897B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#00897B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  locationBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  note: {
    backgroundColor: '#E8EAF6',
    borderRadius: 12,
    padding: 14,
  },
  noteText: { fontSize: 12, color: '#555', lineHeight: 18 },
  noteLink: { color: '#3949AB', fontWeight: '700' },
});
