import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../../shared/components/Card';
import { spacing, radii, useThemeColors } from '../../../shared/theme';
import type { StormEntry } from '../../../shared/types/storm';

interface StormEntryCardProps {
  entry: StormEntry;
  onPress: () => void;
}

export function StormEntryCard({ entry, onPress }: StormEntryCardProps) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="button">
      <Card style={styles.card}>
        <Image source={{ uri: entry.photoUri }} style={styles.thumb} />
        <View style={styles.info}>
          <Text style={[styles.type, { color: colors.text }]}>{entry.stormType.replace('-', ' ')}</Text>
          <Text style={{ color: colors.textMuted }}>{new Date(entry.capturedAt).toLocaleString()}</Text>
          {entry.weatherSummary ? (
            <Text style={{ color: colors.textMuted }} numberOfLines={1}>
              {entry.weatherSummary}
              {entry.temperatureC != null ? ` · ${Math.round(entry.temperatureC)}°C` : ''}
            </Text>
          ) : null}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  thumb: { width: 64, height: 64, borderRadius: radii.md },
  info: { flex: 1, gap: 2 },
  type: { fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
});
