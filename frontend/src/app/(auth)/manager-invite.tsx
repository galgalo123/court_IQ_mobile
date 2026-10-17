import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui';
import { palette } from '@/constants/palette';
import { useAuth } from '@/contexts/auth-context';
import { onboarding } from '@/features/onboarding';

export default function ManagerInvite() {
  const { signIn } = useAuth();
  const pending = onboarding.pending;

  if (!pending) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.body}>Nothing to show here. Create a team again from sign in.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  function openTeam() {
    const user = pending!.user;
    onboarding.pending = null;
    // Signing in switches the app to this manager's dashboard.
    signIn(user);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.step}>TEAM CREATED</Text>
        <Text style={styles.title}>{pending.user.team.name}</Text>

        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Team code</Text>
          <Text style={styles.code}>{pending.code}</Text>
        </View>

        <Text style={styles.body}>
          Share this code with players and staff. They enter it under "Join a team". It stays valid for 7 days.
        </Text>

        <PrimaryButton label="Open my team" onPress={openTeam} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 24, gap: 18 },
  step: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: palette.text, fontSize: 30, fontWeight: '700' },
  codeBox: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 24, alignItems: 'center', gap: 8 },
  codeLabel: { color: palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  code: { color: palette.text, fontSize: 36, fontWeight: '700', letterSpacing: 4 },
  body: { color: palette.muted, fontSize: 14, lineHeight: 21 },
});