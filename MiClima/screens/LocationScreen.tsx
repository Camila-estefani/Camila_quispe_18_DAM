import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';

type Props = {
  onBack: () => void;
};

type LocationData = {
  lat: number;
  lon: number;
  ciudad: string;
  pais: string;
  calle: string;
};

// Clima simulado según coordenadas (para no necesitar API key)
function getClimaSimulado(lat: number): { temp: number; desc: string; icon: string; humedad: number } {
  const abs = Math.abs(lat);
  if (abs < 15)  return { temp: 32, desc: 'Caluroso y húmedo', icon: '☀️', humedad: 85 };
  if (abs < 30)  return { temp: 27, desc: 'Soleado y cálido',  icon: '🌤️', humedad: 60 };
  if (abs < 45)  return { temp: 18, desc: 'Parcialmente nublado', icon: '⛅', humedad: 55 };
  if (abs < 60)  return { temp: 8,  desc: 'Frío y ventoso',    icon: '🌬️', humedad: 70 };
  return          { temp: -5, desc: 'Muy frío con nieve',  icon: '❄️', humedad: 80 };
}

export default function LocationScreen({ onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locData, setLocData] = useState<LocationData | null>(null);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      // Verificar permiso (ya debería estar concedido)
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación no concedido. Vuelve atrás y acepta el permiso.');
        setLoading(false);
        return;
      }

      // Obtener posición
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = pos.coords;

      // Geocodificación inversa para obtener ciudad
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });

      setLocData({
        lat: latitude,
        lon: longitude,
        ciudad: address.city ?? address.subregion ?? 'Ciudad desconocida',
        pais: address.country ?? '',
        calle: address.street ? `${address.street} ${address.streetNumber ?? ''}`.trim() : '',
      });
    } catch (e) {
      setError('No se pudo obtener la ubicación. Verifica que el GPS esté activado.');
    } finally {
      setLoading(false);
    }
  };

  const clima = locData ? getClimaSimulado(locData.lat) : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📍 Mi Ubicación</Text>
        <TouchableOpacity onPress={fetchLocation} style={styles.refreshBtn}>
          <Text style={styles.refreshIcon}>↻</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#3949AB" />
            <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchLocation}>
              <Text style={styles.retryBtnText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : locData && clima ? (
          <>
            {/* Tarjeta ciudad */}
            <View style={styles.cityCard}>
              <Text style={styles.cityName}>{locData.ciudad}</Text>
              <Text style={styles.cityCountry}>{locData.pais}</Text>
              {locData.calle ? <Text style={styles.cityStreet}>📌 {locData.calle}</Text> : null}
            </View>

            {/* Tarjeta clima */}
            <View style={styles.weatherCard}>
              <Text style={styles.weatherIcon}>{clima.icon}</Text>
              <Text style={styles.weatherTemp}>{clima.temp}°C</Text>
              <Text style={styles.weatherDesc}>{clima.desc}</Text>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetail}>
                  <Text style={styles.weatherDetailLabel}>💧 Humedad</Text>
                  <Text style={styles.weatherDetailValue}>{clima.humedad}%</Text>
                </View>
                <View style={styles.weatherDetailDivider} />
                <View style={styles.weatherDetail}>
                  <Text style={styles.weatherDetailLabel}>📍 Latitud</Text>
                  <Text style={styles.weatherDetailValue}>{locData.lat.toFixed(4)}°</Text>
                </View>
                <View style={styles.weatherDetailDivider} />
                <View style={styles.weatherDetail}>
                  <Text style={styles.weatherDetailLabel}>🗺️ Longitud</Text>
                  <Text style={styles.weatherDetailValue}>{locData.lon.toFixed(4)}°</Text>
                </View>
              </View>
            </View>

            {/* Coordenadas raw */}
            <View style={styles.coordCard}>
              <Text style={styles.coordTitle}>Coordenadas GPS</Text>
              <Text style={styles.coordText}>
                {locData.lat.toFixed(6)}, {locData.lon.toFixed(6)}
              </Text>
              <Text style={styles.coordNote}>
                Datos obtenidos con permiso de ubicación en primer plano
              </Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },

  header: {
    backgroundColor: '#3949AB',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 22, color: '#fff', fontWeight: '700' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: '#fff' },
  refreshBtn: { padding: 8 },
  refreshIcon: { fontSize: 22, color: '#fff', fontWeight: '700' },

  body: { padding: 20, paddingBottom: 40 },

  center: { alignItems: 'center', marginTop: 80, gap: 16 },
  loadingText: { fontSize: 14, color: '#666' },

  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    marginTop: 40,
  },
  errorIcon: { fontSize: 40 },
  errorText: { fontSize: 14, color: '#C62828', textAlign: 'center', lineHeight: 20 },
  retryBtn: { backgroundColor: '#E53935', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
  retryBtnText: { color: '#fff', fontWeight: '700' },

  cityCard: {
    backgroundColor: '#3949AB',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#3949AB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cityName: { fontSize: 32, fontWeight: '800', color: '#fff' },
  cityCountry: { fontSize: 16, color: '#C5CAE9', marginTop: 4 },
  cityStreet: { fontSize: 12, color: '#9FA8DA', marginTop: 6 },

  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  weatherIcon: { fontSize: 64, marginBottom: 8 },
  weatherTemp: { fontSize: 48, fontWeight: '800', color: '#222' },
  weatherDesc: { fontSize: 16, color: '#666', marginBottom: 20 },
  weatherDetails: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  weatherDetail: { alignItems: 'center', gap: 4 },
  weatherDetailLabel: { fontSize: 11, color: '#888' },
  weatherDetailValue: { fontSize: 14, fontWeight: '700', color: '#333' },
  weatherDetailDivider: { width: 1, backgroundColor: '#EEE' },

  coordCard: {
    backgroundColor: '#E8EAF6',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  coordTitle: { fontSize: 12, fontWeight: '700', color: '#3949AB' },
  coordText: { fontSize: 15, fontWeight: '600', color: '#333', fontVariant: ['tabular-nums'] },
  coordNote: { fontSize: 11, color: '#888', textAlign: 'center' },
});
