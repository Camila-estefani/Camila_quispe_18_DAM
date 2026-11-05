import * as SQLite from 'expo-sqlite';

export type Note = {
  id: number;
  titulo: string;
  contenido: string;
  color: string;
  fecha: string;
  imagen: string | null; // URI local de la imagen seleccionada
};

const DB_NAME = 'misnotas.db';

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS notas (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo    TEXT NOT NULL,
      contenido TEXT NOT NULL,
      color     TEXT NOT NULL DEFAULT '#FFFFFF',
      fecha     TEXT NOT NULL,
      imagen    TEXT
    );
  `);

  // Migración: agregar columna imagen si ya existía la tabla sin ella
  const cols = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(notas)"
  );
  const hasImagen = cols.some((c) => c.name === 'imagen');
  if (!hasImagen) {
    await db.execAsync('ALTER TABLE notas ADD COLUMN imagen TEXT;');
  }

  return db;
}

export async function getAllNotes(db: SQLite.SQLiteDatabase): Promise<Note[]> {
  return await db.getAllAsync<Note>('SELECT * FROM notas ORDER BY id DESC');
}

export async function insertNote(
  db: SQLite.SQLiteDatabase,
  titulo: string,
  contenido: string,
  color: string,
  imagen: string | null
): Promise<number> {
  const fecha = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const result = await db.runAsync(
    'INSERT INTO notas (titulo, contenido, color, fecha, imagen) VALUES (?, ?, ?, ?, ?)',
    titulo,
    contenido,
    color,
    fecha,
    imagen
  );
  return result.lastInsertRowId;
}

export async function updateNote(
  db: SQLite.SQLiteDatabase,
  id: number,
  titulo: string,
  contenido: string,
  color: string,
  imagen: string | null
): Promise<void> {
  await db.runAsync(
    'UPDATE notas SET titulo = ?, contenido = ?, color = ?, imagen = ? WHERE id = ?',
    titulo,
    contenido,
    color,
    imagen,
    id
  );
}

export async function deleteNote(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM notas WHERE id = ?', id);
}
