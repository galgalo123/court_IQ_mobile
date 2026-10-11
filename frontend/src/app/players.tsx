import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const roster = [
  { initials: 'MC', name: 'Maya Chen', role: 'Guard  ·  #04', points: '18.4', rebounds: '7.2', assists: '4.8', status: 'Available', color: '#27776f' },
  { initials: 'JR', name: 'Jalen Reed', role: 'Forward  ·  #11', points: '14.1', rebounds: '8.5', assists: '2.6', status: 'Limited', color: '#a86337' },
  { initials: 'AS', name: 'Andre Silva', role: 'Center  ·  #23', points: '11.8', rebounds: '10.2', assists: '1.9', status: 'Out', color: '#ad5149' },
  { initials: 'TK', name: 'Talia King', role: 'Guard  ·  #02', points: '16.3', rebounds: '3.8', assists: '6.1', status: 'Available', color: '#6672a0' },
];

export default function PlayersScreen() {
  const [query, setQuery] = useState('');
  const visiblePlayers = roster.filter((player) => player.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}><Text style={styles.kicker}>COURTIQ  /  ROSTER</Text><Text style={styles.title}>Players</Text><Text style={styles.subtitle}>A closer look at the people behind the numbers.</Text></View>
        <View style={styles.summaryBand}>
          <View><Text style={styles.summaryLabel}>ACTIVE ROSTER</Text><Text style={styles.summaryValue}>12 <Text style={styles.summarySuffix}>players</Text></Text></View>
          <View style={styles.summaryDivider} />
          <View><Text style={styles.summaryLabel}>TEAM AVERAGE</Text><Text style={styles.summaryValue}>72.6 <Text style={styles.summarySuffix}>pts / game</Text></Text></View>
          <View style={styles.summaryAccent}><Text style={styles.summaryAccentValue}>+8.2%</Text><Text style={styles.summaryAccentLabel}>last 5 games</Text></View>
        </View>
        <View style={styles.listHeading}><View><Text style={styles.kicker}>PLAYER STORIES</Text><Text style={styles.sectionTitle}>Season snapshots</Text></View><Text style={styles.listCount}>4 SHOWN</Text></View>
        <TextInput accessibilityLabel="Search players" value={query} onChangeText={setQuery} placeholder="Find a player" placeholderTextColor="#8c9288" style={styles.search} />
        {visiblePlayers.map((player, index) => (
          <View key={player.initials} style={styles.playerRow}>
            <View style={[styles.avatar, { backgroundColor: player.color }]}><Text style={styles.avatarText}>{player.initials}</Text></View>
            <View style={styles.identity}><Text style={styles.playerName}>{player.name}</Text><Text style={styles.playerRole}>{player.role}</Text><Text style={[styles.availability, player.status === 'Available' && styles.available, player.status === 'Out' && styles.out]}>{player.status}  ·  game availability</Text></View>
            <View style={styles.storyStats}><Metric value={player.points} label="PTS" tint="#d8fa53" /><Metric value={player.rebounds} label="REB" tint="#74d9d2" /><Metric value={player.assists} label="AST" tint="#ff9a7a" /></View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Open ${player.name} season details`} onPress={() => {}} style={styles.openButton}><Text style={styles.openButtonText}>{'>'}</Text></Pressable>
            {index === 0 ? <View style={styles.captainTag}><Text style={styles.captainText}>CAPTAIN</Text></View> : null}
          </View>
        ))}
        <Text style={styles.privacyNote}>Health information is not shown here. Only game availability is visible to the team.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ value, label, tint }: { value: string; label: string; tint: string }) {
  return <View style={styles.metric}><View style={[styles.metricRing, { borderColor: tint }]}><Text style={styles.metricValue}>{value}</Text></View><Text style={styles.metricLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f0e8' },
  content: { width: '100%', maxWidth: 1050, alignSelf: 'center', padding: 24, paddingBottom: 50 },
  header: { paddingVertical: 24 },
  kicker: { color: '#8b6d53', fontSize: 9, fontWeight: '900' },
  title: { color: '#182019', fontFamily: 'Avenir Next', fontSize: 29, fontWeight: '700', marginTop: 7 },
  subtitle: { color: '#6d736a', fontSize: 13, marginTop: 5 },
  summaryBand: { backgroundColor: '#25332a', borderRadius: 7, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' },
  summaryLabel: { color: '#b8c2b3', fontSize: 8, fontWeight: '900' },
  summaryValue: { color: '#fffefa', fontSize: 22, fontWeight: '800', marginTop: 5 },
  summarySuffix: { color: '#c4cdc0', fontSize: 10, fontWeight: '500' },
  summaryDivider: { width: 1, height: 38, backgroundColor: '#4a554b' },
  summaryAccent: { backgroundColor: '#d8fa53', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 5 },
  summaryAccentValue: { color: '#1c2921', fontSize: 13, fontWeight: '900' },
  summaryAccentLabel: { color: '#40503b', fontSize: 8, marginTop: 3 },
  listHeading: { marginTop: 28, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionTitle: { color: '#1b241d', fontSize: 18, fontWeight: '700', marginTop: 4 },
  listCount: { color: '#898c84', fontSize: 9, fontWeight: '800' },
  search: { height: 41, backgroundColor: '#fbfaf5', borderWidth: 1, borderColor: '#d6d8cf', borderRadius: 5, paddingHorizontal: 12, color: '#1c2921', fontSize: 12, marginBottom: 8 },
  playerRow: { minHeight: 105, borderBottomWidth: 1, borderBottomColor: '#ddded5', flexDirection: 'row', alignItems: 'center', gap: 13, position: 'relative', paddingVertical: 15 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fffefa', fontSize: 10, fontWeight: '900' },
  identity: { flex: 1, minWidth: 108 },
  playerName: { color: '#253129', fontSize: 13, fontWeight: '800' },
  playerRole: { color: '#777e74', fontSize: 10, marginTop: 4 },
  availability: { color: '#a56633', fontSize: 9, fontWeight: '800', marginTop: 7 },
  available: { color: '#27776f' },
  out: { color: '#ad5149' },
  storyStats: { flexDirection: 'row', gap: 10 },
  metric: { alignItems: 'center', gap: 4 },
  metricRing: { width: 46, height: 46, borderRadius: 23, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  metricValue: { color: '#253129', fontSize: 11, fontWeight: '900' },
  metricLabel: { color: '#83887e', fontSize: 8, fontWeight: '900' },
  openButton: { width: 26, height: 36, alignItems: 'center', justifyContent: 'center' },
  openButtonText: { color: '#858a80', fontSize: 14 },
  captainTag: { position: 'absolute', top: 3, left: 53 },
  captainText: { color: '#837047', fontSize: 7, fontWeight: '900' },
  privacyNote: { color: '#85877e', fontSize: 10, lineHeight: 15, marginTop: 16 },
});