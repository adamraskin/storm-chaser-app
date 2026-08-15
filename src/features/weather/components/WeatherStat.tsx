import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing, useThemeColors } from '../../../shared/theme';

interface WeatherStatProps {
  label: string;
  value: string;
}

export function WeatherStat({ label, value }: WeatherStatProps) {
  const colors = useThemeColors()
  return (
    <View style={styles.container}>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>

      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, gap: spacing.xs },
  value: { fontSize: 20, fontWeight: '700' },
  label: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
});
