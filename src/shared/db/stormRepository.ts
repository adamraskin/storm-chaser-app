import { getDatabase } from './database';
import type { NewStormEntry, StormEntry } from '../types/storm';

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function insertStormEntry(entry: NewStormEntry): Promise<StormEntry> {
  const db = await getDatabase();
  const id = generateId();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO storm_entries
      (id, photoUri, latitude, longitude, capturedAt, temperatureC, windSpeedKph, precipitationMm, weatherSummary, stormType, notes, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      entry.photoUri,
      entry.latitude,
      entry.longitude,
      entry.capturedAt,
      entry.temperatureC,
      entry.windSpeedKph,
      entry.precipitationMm,
      entry.weatherSummary,
      entry.stormType,
      entry.notes,
      createdAt,
    ]
  );

  return { id, createdAt, ...entry };
}

export async function getAllStormEntries(): Promise<StormEntry[]> {
  const db = await getDatabase()
  return db.getAllAsync<StormEntry>('SELECT * FROM storm_entries ORDER BY capturedAt DESC');
}

export async function getStormEntryById(id: string): Promise<StormEntry | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<StormEntry>('SELECT * FROM storm_entries WHERE id = ?', [id])
  return row ?? null;
}

export async function deleteStormEntry(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM storm_entries WHERE id = ?', [id]);
}
