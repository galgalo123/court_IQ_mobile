import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>PROFILE</Text>
        <Text style={styles.title}>{user?.name ?? 'Account'}</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user?.role}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <Pressable onPress={signOut} style={styles.signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 16 },
  kicker: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 32, fontWeight: '700' },
  card: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 16, gap: 6 },
  label: { color: palette.muted, fontSize: 12, fontWeight: '600', marginTop: 8 },
  value: { color: palette.text, fontSize: 16 },
  signOut: { borderColor: palette.border, borderWidth: 1, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' },
  signOutText: { color: palette.error, fontSize: 16, fontWeight: '600' },
});
