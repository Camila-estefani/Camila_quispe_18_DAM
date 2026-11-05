# 📝 MisNotas

App de notas con almacenamiento local desarrollada con **Expo SDK 58** y **expo-sqlite**.

## Funcionalidad implementada

**Almacenamiento local con SQLite** — las notas se guardan de forma persistente en la base de datos del dispositivo. No se pierden al cerrar la app.

### Características
- ✅ Crear notas con título y contenido
- ✅ Editar notas existentes
- ✅ Eliminar notas con botón de papelera
- ✅ Elegir color de tarjeta (paleta de 8 colores)
- ✅ Vista en cuadrícula de 2 columnas
- ✅ Fecha de creación automática
- ✅ Animación al presionar tarjetas

## Estructura del proyecto

```
MisNotas/
├── App.tsx               # Navegación principal (home ↔ editor)
├── database/
│   └── db.ts             # Capa de datos: openDatabase, CRUD con SQLite
├── screens/
│   ├── HomeScreen.tsx    # Lista de notas en cuadrícula
│   └── EditorScreen.tsx  # Formulario crear/editar nota
└── assets/               # Iconos e imágenes
```

## Cómo correr el proyecto

```bash
cd MisNotas
npx expo start --android   # en emulador Android
npx expo start --ios       # en simulador iOS
npx expo start             # escanear con Expo Go
```

## Tecnologías usadas

| Tecnología | Versión |
|---|---|
| Expo SDK | ~58.0.23 |
| expo-sqlite | ^58.0.15 |
| React Native | 0.88.1 |
| React | 19.3.0 |
| TypeScript | ~6.0.3 |
