import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRole } from '@/contexts/role-context';

const teamAvailability = [
  { initials: 'MC', name: 'Maya Chen', status: 'Available', shade: '#27776f' },
  { initials: 'JR', name: 'Jalen Reed', status: 'Limited', shade: '#a86337' },
  { initials: 'AS', name: 'Andre Silva', status: 'Out', shade: '#ad5149' },
];

export default function HealthScreen() {
  const { role } = useRole();
  const [selectedPlayer, setSelectedPlayer] = useState('Maya Chen');
  const canReadRecord = role === 'Doctor' || role === 'Player';
  const patientName = role === 'Player' ? 'Maya Chen' : selectedPlayer;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}><Text style={styles.kicker}>COURTIQ  /  PLAYER WELLNESS</Text><Text style={styles.title}>Health & availability</Text><Text style={styles.subtitle}>Team readiness, with personal medical information protected.</Text></View>
        <View style={styles.privacyBanner}>
          <View style={styles.lockMark}><Text style={styles.lockText}>+</Text></View>
          <View style={styles.privacyCopy}><Text style={styles.privacyTitle}>Private by default</Text><Text style={styles.privacyBody}>Coaches, statisticians, and teammates see availability only. Medical notes are restricted to the team doctor and the player concerned.</Text></View>
        </View>
        <View style={styles.sectionHeader}><View><Text style={styles.kicker}>TEAM VIEW</Text><Text style={styles.sectionTitle}>Game availability</Text></View><Text style={styles.statusCount}>3 PLAYERS FLAGGED</Text></View>
        {teamAvailability.map((player) => (
          <Pressable key={player.name} accessibilityRole={canReadRecord ? 'button' : undefined} accessibilityState={canReadRecord ? { selected: selectedPlayer === player.name } : undefined} onPress={() => { if (role === 'Doctor') setSelectedPlayer(player.name); }} style={[styles.availabilityRow, role === 'Doctor' && selectedPlayer === player.name && styles.availabilitySelected]}>
            <View style={[styles.avatar, { backgroundColor: player.shade }]}><Text style={styles.avatarText}>{player.initials}</Text></View>
            <View style={styles.playerInfo}><Text style={styles.playerName}>{role === 'Player' && player.name !== 'Maya Chen' ? 'Teammate' : player.name}</Text><Text style={styles.playerSub}>{role === 'Player' && player.name !== 'Maya Chen' ? 'Team status' : 'Basketball  ·  first team'}</Text></View>
            <Text style={[styles.availability, player.status === 'Available' && styles.available, player.status === 'Out' && styles.out]}>{player.status}</Text>
          </Pressable>
        ))}
        {canReadRecord ? (
          <View style={styles.recordSection}>
            <View style={styles.sectionHeader}><View><Text style={styles.kicker}>RESTRICTED RECORD</Text><Text style={styles.sectionTitle}>{role === 'Doctor' ? patientName : 'Your medical details'}</Text></View>{role === 'Doctor' ? <Text style={styles.doctorBadge}>DOCTOR VIEW</Text> : <Text style={styles.playerBadge}>YOUR RECORD</Text>}</View>
            <View style={styles.recordLine}><Text style={styles.recordLabel}>CURRENT NOTE</Text><Text style={styles.recordValue}>Ankle strain, under review</Text></View>
            <View style={styles.recordLine}><Text style={styles.recordLabel}>CARE PLAN</Text><Text style={styles.recordValue}>Mobility work and reassessment before next fixture</Text></View>
            <View style={[styles.recordLine, styles.lastRecordLine]}><Text style={styles.recordLabel}>LAST UPDATED</Text><Text style={styles.recordValue}>Today  ·  9:15 AM</Text></View>
            <Text style={styles.recordDisclaimer}>Preview record only. In the live system, access must be enforced by the backend for the signed-in user.</Text>
          </View>
        ) : (
          <View style={styles.restrictedState}><Text style={styles.restrictedTitle}>Medical details are restricted</Text><Text style={styles.restrictedBody}>Your role can see whether a player is available, limited, or out. The doctor and the affected player can view the private record.</Text></View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f0e8' },
  content: { width: '100%', maxWidth: 980, alignSelf: 'center', padding: 24, paddingBottom: 50 },
  header: { paddingVertical: 24 },
  kicker: { color: '#8b6d53', fontSize: 9, fontWeight: '900' },
  title: { color: '#182019', fontSize: 28, fontFamily: 'Avenir Next', fontWeight: '700', marginTop: 7 },
  subtitle: { color: '#6d736a', fontSize: 13, marginTop: 5 },
  privacyBanner: { flexDirection: 'row', gap: 12, padding: 15, backgroundColor: '#dcebe1', borderRadius: 6, alignItems: 'flex-start' },
  lockMark: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#2f6654', alignItems: 'center', justifyContent: 'center' },
  lockText: { color: '#eff9ed', fontSize: 16, fontWeight: '800' },
  privacyCopy: { flex: 1 },
  privacyTitle: { color: '#214737', fontSize: 12, fontWeight: '900' },
  privacyBody: { color: '#466858', fontSize: 10, lineHeight: 16, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8, marginTop: 27, marginBottom: 12 },
  sectionTitle: { color: '#1b241d', fontSize: 17, fontWeight: '700', marginTop: 4 },
  statusCount: { color: '#898c84', fontSize: 8, fontWeight: '900' },
  availabilityRow: { minHeight: 61, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, borderBottomWidth: 1, borderBottomColor: '#ddded5', gap: 11 },
  availabilitySelected: { backgroundColor: '#e7e9df' },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fffefa', fontSize: 8, fontWeight: '900' },
  playerInfo: { flex: 1 },
  playerName: { color: '#283129', fontSize: 12, fontWeight: '800' },
  playerSub: { color: '#85877e', fontSize: 9, marginTop: 4 },
  availability: { color: '#a56633', fontSize: 10, fontWeight: '900' },
  available: { color: '#27776f' },
  out: { color: '#ad5149' },
  recordSection: { marginTop: 12 },
  doctorBadge: { color: '#315d4e', backgroundColor: '#dcebe1', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4, fontSize: 8, fontWeight: '900' },
  playerBadge: { color: '#6f5d31', backgroundColor: '#efe5c6', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4, fontSize: 8, fontWeight: '900' },
  recordLine: { borderTopWidth: 1, borderTopColor: '#ddded5', paddingVertical: 13, gap: 5 },
  lastRecordLine: { borderBottomWidth: 1, borderBottomColor: '#ddded5' },
  recordLabel: { color: '#888b82', fontSize: 8, fontWeight: '900' },
  recordValue: { color: '#283129', fontSize: 12, lineHeight: 17, fontWeight: '600' },
  recordDisclaimer: { color: '#898c84', fontSize: 9, lineHeight: 14, marginTop: 10 },
  restrictedState: { backgroundColor: '#ebe9e1', padding: 17, borderRadius: 6, marginTop: 25 },
  restrictedTitle: { color: '#3b423a', fontSize: 12, fontWeight: '900' },
  restrictedBody: { color: '#73786f', fontSize: 10, lineHeight: 16, marginTop: 5 },
});