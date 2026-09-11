// Pantalla 1: Login
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.hideAsync();

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  function handleLogin() {
    if (!phone.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    // Credenciales simples de demostración
    if (phone === '123456' && password === '123456') {
      router.replace('/chats');
    } else {
      Alert.alert('Error', 'Número o contraseña incorrectos\n\nUsa: 123456 / 123456');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header verde */}
      <View style={styles.header}>
        <Text style={styles.logo}>WhatsApp</Text>
      </View>

      <View style={styles.body}>
        {/* Ícono */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>💬</Text>
        </View>

        <Text style={styles.title}>Ingresa tu número</Text>
        <Text style={styles.subtitle}>
          WhatsApp verifica tu número de teléfono.
        </Text>

        {/* Campo teléfono */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Número de teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 123456"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Campo contraseña */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
          />
        </View>

        <Text style={styles.hint}>Demo: usa 123456 en ambos campos</Text>

        {/* Botón siguiente */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>SIGUIENTE</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#075E54',
    paddingTop: 50,
    paddingBottom: 16,
    alignItems: 'center',
  },
  logo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#DCF8C6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 44,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#075E54',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: '#075E54',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#25D366',
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
  },
  hint: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#25D366',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
