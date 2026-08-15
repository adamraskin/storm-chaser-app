export type StormType =
  | 'supercell'
  | 'tornado'
  | 'hail'
  | 'flash-flood'
  | 'derecho'
  | 'wall-cloud'
  | 'funnel-cloud'
  | 'lightning'
  | 'other';

export const STORM_TYPES: StormType[] = [
  'supercell',
  'tornado',
  'hail',
  'flash-flood',
  'derecho',
  'wall-cloud',
  'funnel-cloud',
  'lightning',
  'other',
];

export interface StormEntry {
  id: string
  photoUri: string;
  latitude: number;
  longitude: number;
  capturedAt: string;
  temperatureC: number | null;
  windSpeedKph: number | null;
  precipitationMm: number | null;
  weatherSummary: string | null;
  stormType: StormType;
  notes: string;
  createdAt: string;
}

export type NewStormEntry = Omit<StormEntry, 'id' | 'createdAt'>;
