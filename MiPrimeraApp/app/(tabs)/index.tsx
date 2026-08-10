import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';

export default function HomeScreen() {
  const mostrarSaludo = () => {
    Alert.alert(
      "¡Hola Miss Valery Chumpitaz! 👋",
      "¡Bienvenida a mi primera aplicación en React Native!"
    );
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.card}>
        {/* Saludo Inicial (Tamaño 1, Color 1) */}
        <Text style={styles.greeting}>Hola Mundo 👋</Text>

        {/* Emoji de personalidad */}
        <Text style={styles.emoji}>🌸💐</Text>

        {/* Nombre Completo (Tamaño 2, Color 2) */}
        <Text style={styles.name}>Camila Quispe Bustinza</Text>

        {/* Carrera y Ciclo (Tamaño 3, Color 3) */}
        <Text style={styles.detailText}>🎓 Carrera: Análisis de Sistemas Empresariales</Text>
        <Text style={styles.detailText}>📚 Ciclo: 4to Semestre</Text>
        <Text style={styles.detailText}>📅 Fecha: 10 de Agosto</Text>

        {/* Botón Saludar */}
        <TouchableOpacity style={styles.button} onPress={mostrarSaludo}>
          <Text style={styles.buttonText}>Saludar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Requisito: Cambiar color de fondo y centrar vertical y horizontalmente
  screenContainer: {
    flex: 1,
    backgroundColor: '#0F172A', // Fondo oscuro elegante
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Requisito: Tarjeta con bordes redondeados, padding y sombra
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    // Sombras (elevation para Android)
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  // Tamaño de fuente 1 (30px) y Color 1 (#38BDF8)
  greeting: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  // Tamaño de fuente 2 (22px) y Color 2 (#FFFFFF)
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  // Tamaño de fuente 3 (15px) y Color 3 (#94A3B8)
  detailText: {
    fontSize: 15,
    color: '#94A3B8',
    marginVertical: 4,
    textAlign: 'center',
  },
  // Botón "Saludar"
  button: {
    marginTop: 20,
    backgroundColor: '#38BDF8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});