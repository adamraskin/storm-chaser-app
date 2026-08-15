import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { Card } from '../../../shared/components/Card';
import { spacing, radii, useThemeColors } from '../../../shared/theme';
import { getStormEntryById } from '../../../shared/db/stormRepository';
import { showConfirm } from '../../../shared/utils/alert';
import type { StormEntry } from '../../../shared/types/storm';
import type { StormLogStackParamList } from '../../../shared/navigation/types';
import { useStormLogViewModel } from '../hooks/useStormLogViewModel';

type Props = NativeStackScreenProps<StormLogStackParamList, 'StormLogDetail'>;

export function StormLogDetailScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { removeEntry } = useStormLogViewModel();
  const [entry, setEntry] = useState<StormEntry | null | undefined>(undefined);

  useEffect(() => {
    getStormEntryById(route.params.entryId).then(setEntry);
  }, [route.params.entryId]);

  if (entry === undefined) return null;
  if (entry === null) {
    return (
      <ScreenContainer>
        <Text style={{ color: colors.text }}>Entry not found.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Image source={{ uri: entry.photoUri }} style={styles.photo} />

        <Text style={[styles.title, { color: colors.text }]}>{entry.stormType.replace('-', ' ')}</Text>
        <Text style={{ color: colors.textMuted, marginBottom: spacing.md }}>
          {new Date(entry.capturedAt).toLocaleString()}
        </Text>

        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
          <Text style={{ color: colors.textMuted }}>
            {entry.latitude.toFixed(4)}, {entry.longitude.toFixed(4)}
          </Text>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Weather Conditions</Text>
          <Text style={{ color: colors.textMuted }}>{entry.weatherSummary ?? 'Not recorded'}</Text>
          <View style={styles.statsRow}>
            <Text style={{ color: colors.text }}>{entry.temperatureC != null ? `${entry.temperatureC}°C` : '—'}</Text>
            <Text style={{ color: colors.text }}>{entry.windSpeedKph != null ? `${entry.windSpeedKph} kph` : '—'}</Text>
            <Text style={{ color: colors.text }}>{entry.precipitationMm != null ? `${entry.precipitationMm} mm` : '—'}</Text>
          </View>
        </Card>

        {entry.notes ? (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
            <Text style={{ color: colors.textMuted }}>{entry.notes}</Text>
          </Card>
        ) : null}

        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: colors.danger }]}
          onPress={() =>
            showConfirm('Delete entry', 'This cannot be undone.', 'Delete', async () => {
              await removeEntry(entry.id);
              navigation.goBack();
            })
          }
        >
          <Text style={{ color: colors.danger, fontWeight: '700' }}>Delete Entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: radii.lg },
  title: { fontSize: 22, fontWeight: '700', marginTop: spacing.md, textTransform: 'capitalize' },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: spacing.xs },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  deleteButton: {
    marginTop: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
