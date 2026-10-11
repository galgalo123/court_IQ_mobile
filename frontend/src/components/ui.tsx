import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { palette } from '@/constants/palette';

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={palette.muted} style={styles.input} {...props} />
    </View>
  );
}

export function PrimaryButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.button, disabled && styles.disabled]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 12,
    color: palette.text,
    fontSize: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  button: { backgroundColor: palette.text, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: palette.inverse, fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.4 },
});
