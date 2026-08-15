export const DATABASE_NAME = 'storm-chaser.db';

export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS storm_entries (
  id TEXT PRIMARY KEY NOT NULL,
  photoUri TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  capturedAt TEXT NOT NULL,
  temperatureC REAL,
  windSpeedKph REAL,
  precipitationMm REAL,
  weatherSummary TEXT,
  stormType TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  createdAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_storm_entries_capturedAt ON storm_entries (capturedAt DESC);
`;
