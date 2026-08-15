import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { radii, spacing, useThemeColors } from '../theme';

interface LabeledInputProps extends TextInputProps {
  label: string;
}

export function LabeledInput({ label, style, ...rest }: LabeledInputProps) {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical:spacing.sm,
    fontSize: 15,
  },
});
