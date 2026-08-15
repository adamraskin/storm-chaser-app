import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { radii, spacing, useThemeColors } from '../../../shared/theme';
import { STORM_TYPES, StormType } from '../../../shared/types/storm';

interface StormTypePickerProps {
  value: StormType;
  onChange: (value: StormType) => void;
}

export function StormTypePicker({ value, onChange }: StormTypePickerProps) {
  const colors = useThemeColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {STORM_TYPES.map((type) => {
        const selected = type === value;
        return (
          <TouchableOpacity
            key={type}
            onPress={() => onChange(type)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? colors.primary : colors.surface,
                borderColor: selected ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={{ color: selected ? '#FFFFFF' : colors.text, fontWeight: '600' }}>
              {type.replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
