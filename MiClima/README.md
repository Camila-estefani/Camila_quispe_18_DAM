# 🔐 MiClima — Gestión de Permisos

App móvil desarrollada con **Expo SDK 58** que demuestra cómo solicitar y gestionar permisos del dispositivo.

## Funcionalidad implementada

**Permisos: solicitar y gestionar permisos del dispositivo**

### Permisos gestionados
| Permiso | Librería | Uso |
|---|---|---|
| 📍 Ubicación (foreground) | `expo-location` | Obtener posición GPS y ciudad |
| 📷 Cámara | `expo-camera` | Acceso a la cámara del dispositivo |
| 🎙️ Micrófono | `expo-camera` | Acceso al micrófono |

### Características
- ✅ Verificación del estado actual de cada permiso al iniciar
- ✅ Solicitud individual por permiso con botón dedicado
- ✅ Solicitud masiva de todos los permisos de una vez
- ✅ Indicador visual de estado: sin solicitar / concedido / denegado
- ✅ Barra de progreso por permiso
- ✅ Redirección a Ajustes del sistema si el permiso fue denegado
- ✅ Pantalla de ubicación real con geocodificación inversa (ciudad, calle)

## Estructura

```
MiClima/
├── App.tsx                      # Navegación entre pantallas
├── screens/
│   ├── PermissionsScreen.tsx    # Panel de gestión de permisos
│   └── LocationScreen.tsx       # Resultado de ubicación GPS
└── README.md
```

## Cómo correr

```bash
cd MiClima
npx expo start --android
```

## Tecnologías

| Paquete | Versión |
|---|---|
| expo | ~58.0.x |
| expo-location | latest compatible |
| expo-camera | latest compatible |
| React Native | 0.88.x |
| TypeScript | ~6.0.x |
