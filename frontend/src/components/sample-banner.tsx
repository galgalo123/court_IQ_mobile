import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/palette';
import { SHOW_SAMPLE_DATA } from '@/features/sample';

// Marks every screen that shows example numbers, so nobody mistakes them for real data.
export function SampleBanner() {
  if (!SHOW_SAMPLE_DATA) return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>SAMPLE DATA · for presentation only</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderColor: palette.warning, borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  text: { color: palette.warning, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
});