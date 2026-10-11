import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRole, type Role } from '@/contexts/role-context';

type Period = 'Last 5' | 'Season';

const roles: Role[] = ['Statistician', 'Player', 'Coach', 'Doctor'];

const roleCopy: Record<Role, { greeting: string; focus: string; action: string }> = {
  Statistician: {
    greeting: 'Game day, Jordan.',
    focus: 'Your stat desk is ready for tonight.',
    action: 'Open stat sheet',
  },
  Player: {
    greeting: 'Keep building, Maya.',
    focus: 'Your season is moving in the right direction.',
    action: 'View my games',
  },
  Coach: {
    greeting: 'Good afternoon, Coach.',
    focus: 'The squad is trending up before tip-off.',
    action: 'Review roster',
  },
  Doctor: {
    greeting: 'Good afternoon, Dr. Lewis.',
    focus: 'Three players have an active availability status.',
    action: 'Review availability',
  },
};

const ringStats = [
  { label: 'Points', value: '18.4', fill: 0.78, color: '#d8fa53' },
  { label: 'Rebounds', value: '7.2', fill: 0.62, color: '#74d9d2' },
  { label: 'Assists', value: '4.8', fill: 0.48, color: '#ff9a7a' },
];

const availability = [
  { initials: 'MC', name: 'Maya Chen', status: 'Available', color: '#27776f' },
  { initials: 'JR', name: 'Jalen Reed', status: 'Limited', color: '#a86337' },
  { initials: 'AS', name: 'Andre Silva', status: 'Out', color: '#ad5149' },
];

function MetricRing({
  label,
  value,
  fill,
  color,
}: {
  label: string;
  value: string;
  fill: number;
  color: string;
}) {
  return (
    <View style={styles.ringItem}>
      <View style={[styles.ringOuter, { borderColor: '#444b42' }]}>
        <View
          style={[
            styles.ringArc,
            { borderColor: color, borderTopColor: 'transparent', transform: [{ rotate: `${fill * 300}deg` }] },
          ]}
        />
        <View style={styles.ringCenter}>
          <Text style={styles.ringValue}>{value}</Text>
        </View>
      </View>
      <Text style={styles.ringLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { role, setRole, isCaptain, setIsCaptain } = useRole();
  const [period, setPeriod] = useState<Period>('Last 5');
  const [notice, setNotice] = useState('');
  const isPrivateHealthRole = role === 'Player' || role === 'Doctor';
  const copy = roleCopy[role];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>C</Text></View>
            <Text style={styles.brand}>COURTIQ</Text>
          </View>
          <View style={styles.userMark}><Text style={styles.userMarkText}>{role === 'Player' ? 'MC' : role.slice(0, 2).toUpperCase()}</Text></View>
        </View>

        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>MONDAY, OCTOBER 5  /  TEAM DASHBOARD</Text>
          <Text style={styles.title}>{copy.greeting}</Text>
          <Text style={styles.subtitle}>{copy.focus}</Text>
        </View>

        <View style={styles.roleSection}>
          <Text style={styles.fieldLabel}>PREVIEW ROLE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleRail}>
            {roles.map((item) => {
              const selected = item === role;
              return (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => { setRole(item); setNotice(''); }}
                  style={[styles.roleButton, selected && styles.roleButtonSelected]}>
                  <Text style={[styles.roleButtonText, selected && styles.roleButtonTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {role === 'Player' ? (
            <View style={styles.captainToggle}>
              <Text style={styles.captainToggleLabel}>CAPTAIN SCHEDULING ACCESS</Text>
              <Switch value={isCaptain} onValueChange={setIsCaptain} trackColor={{ false: '#c5c8be', true: '#83ad83' }} thumbColor={isCaptain ? '#234b39' : '#f8f7f2'} />
            </View>
          ) : null}
        </View>

        <View style={styles.featuredMatch}>
          <View style={styles.matchTopline}>
            <Text style={styles.matchTag}>NEXT UP  /  LEAGUE GAME</Text>
            <View style={styles.liveDot} />
          </View>
          <Text style={styles.matchDate}>TONIGHT  ·  6:30 PM</Text>
          <View style={styles.matchup}>
            <View>
              <Text style={styles.teamName}>CourtIQ</Text>
              <Text style={styles.teamMeta}>HOME  ·  COURT 2</Text>
            </View>
            <Text style={styles.versus}>VS</Text>
            <View style={styles.opponentBlock}>
              <Text style={styles.teamName}>Northside</Text>
              <Text style={styles.teamMeta}>AWAY</Text>
            </View>
          </View>
          <View style={styles.matchFooter}>
            <Text style={styles.matchFooterText}>Warm-up starts in 46 min</Text>
            <Pressable onPress={() => setNotice('Game details are ready to connect to your team schedule.')} style={styles.matchAction}>
              <Text style={styles.matchActionText}>{copy.action}  {'>'}</Text>
            </Pressable>
          </View>
        </View>

        {notice ? <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text> : null}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionKicker}>PLAYER STORY</Text>
            <Text style={styles.sectionTitle}>{role === 'Player' ? 'Your season, at a glance' : 'Maya Chen'}</Text>
          </View>
          <View style={styles.periodSwitch}>
            {(['Last 5', 'Season'] as Period[]).map((item) => (
              <Pressable key={item} onPress={() => setPeriod(item)} style={[styles.periodButton, period === item && styles.periodButtonActive]}>
                <Text style={[styles.periodText, period === item && styles.periodTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.performanceBand}>
          <View style={styles.performanceIntro}>
            <Text style={styles.performanceName}>{period === 'Last 5' ? 'LAST FIVE GAMES' : '2025 / 26 SEASON'}</Text>
            <Text style={styles.performanceSummary}>A steady climb.{ '\n' }Keep the rhythm.</Text>
            <Text style={styles.performanceDetail}>+12% impact vs. previous stretch</Text>
          </View>
          <View style={styles.ringGroup}>
            {ringStats.map((stat) => <MetricRing key={stat.label} {...stat} />)}
          </View>
        </View>

        <View style={styles.lowerGrid}>
          <View style={styles.sectionColumn}>
            <View style={styles.sectionHeaderCompact}>
              <View>
                <Text style={styles.sectionKicker}>TEAM PULSE</Text>
                <Text style={styles.sectionTitle}>Availability</Text>
              </View>
              <Text style={styles.smallCount}>03 ACTIVE</Text>
            </View>
            <View style={styles.availabilityList}>
              {availability.map((player) => (
                <View key={player.initials} style={styles.availabilityRow}>
                  <View style={[styles.playerAvatar, { backgroundColor: player.color }]}><Text style={styles.playerAvatarText}>{player.initials}</Text></View>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={[styles.statusText, player.status === 'Available' && styles.statusAvailable, player.status === 'Out' && styles.statusOut]}>{player.status}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.privacyNote}>Injury details are private. This list only shows game availability.</Text>
            {isPrivateHealthRole ? (
              <Pressable onPress={() => setNotice(role === 'Doctor' ? 'Private medical notes are visible only in the secure doctor workspace.' : 'Your personal medical notes are visible only to you and the team doctor.')}>
                <Text style={styles.privateLink}>{role === 'Doctor' ? 'Open secure medical workspace  >' : 'View your private health details  >'}</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.sectionColumn}>
            <View style={styles.sectionHeaderCompact}>
              <View>
                <Text style={styles.sectionKicker}>ON THE CALENDAR</Text>
                <Text style={styles.sectionTitle}>Coming up</Text>
              </View>
              <Text style={styles.smallCount}>OCT 2026</Text>
            </View>
            <View style={styles.scheduleItem}>
              <View style={styles.dateTile}><Text style={styles.dateMonth}>OCT</Text><Text style={styles.dateDay}>08</Text></View>
              <View style={styles.scheduleInfo}><Text style={styles.scheduleTitle}>Eastside Falcons</Text><Text style={styles.scheduleMeta}>Away  ·  7:00 PM</Text></View>
              <Text style={styles.scheduleChevron}>{'>'}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <View style={[styles.dateTile, styles.dateTileBlue]}><Text style={styles.dateMonth}>OCT</Text><Text style={styles.dateDay}>12</Text></View>
              <View style={styles.scheduleInfo}><Text style={styles.scheduleTitle}>Harbor Athletics</Text><Text style={styles.scheduleMeta}>Home  ·  5:30 PM</Text></View>
              <Text style={styles.scheduleChevron}>{'>'}</Text>
            </View>
            {(role === 'Statistician' || (role === 'Player' && isCaptain)) ? (
              <Pressable onPress={() => setNotice('Schedule creation will be connected to the team account and captain permissions.')} style={styles.createGameButton}>
                <Text style={styles.createGameText}>+  Add scheduled game</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
        <Text style={styles.demoFootnote}>PREVIEW DATA  /  Role selection here is for layout review, not account access.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f0e8' },
  content: { width: '100%', maxWidth: 1120, alignSelf: 'center', paddingHorizontal: 24, paddingBottom: 44 },
  topBar: { height: 68, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#d9d8d0' },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 30, height: 30, borderRadius: 9, backgroundColor: '#d8fa53', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { fontSize: 17, fontWeight: '900', color: '#182019' },
  brand: { color: '#172019', fontSize: 13, fontWeight: '900', letterSpacing: 0 },
  userMark: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#c8e6df', alignItems: 'center', justifyContent: 'center' },
  userMarkText: { fontSize: 10, fontWeight: '800', color: '#24473d' },
  headingBlock: { paddingTop: 30, paddingBottom: 22 },
  eyebrow: { color: '#70766d', fontSize: 10, fontWeight: '800', letterSpacing: 0, marginBottom: 10 },
  title: { color: '#182019', fontFamily: 'Avenir Next', fontSize: 31, fontWeight: '700' },
  subtitle: { color: '#6d736a', fontSize: 14, marginTop: 5 },
  roleSection: { marginBottom: 20 },
  fieldLabel: { color: '#777c73', fontSize: 9, fontWeight: '800', marginBottom: 9 },
  roleRail: { gap: 8 },
  roleButton: { paddingHorizontal: 15, minHeight: 37, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderWidth: 1, borderColor: '#d2d3ca', backgroundColor: '#f8f7f2' },
  roleButtonSelected: { backgroundColor: '#19221c', borderColor: '#19221c' },
  roleButtonText: { color: '#5d645c', fontSize: 12, fontWeight: '700' },
  roleButtonTextSelected: { color: '#e9f4bc' },
  captainToggle: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  captainToggleLabel: { color: '#777c73', fontSize: 9, fontWeight: '800' },
  featuredMatch: { backgroundColor: '#19221c', borderRadius: 8, padding: 22, overflow: 'hidden' },
  matchTopline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchTag: { color: '#b6c0af', fontSize: 9, fontWeight: '800' },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#d8fa53' },
  matchDate: { marginTop: 18, color: '#d8fa53', fontSize: 10, fontWeight: '800' },
  matchup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  teamName: { color: '#f8f7f1', fontSize: 24, fontFamily: 'Avenir Next', fontWeight: '700' },
  teamMeta: { marginTop: 5, color: '#a0aa9d', fontSize: 9, fontWeight: '700' },
  versus: { color: '#798274', fontSize: 11, fontWeight: '800' },
  opponentBlock: { alignItems: 'flex-end' },
  matchFooter: { marginTop: 21, borderTopWidth: 1, borderTopColor: '#384139', paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  matchFooterText: { color: '#b6c0af', fontSize: 11 },
  matchAction: { minHeight: 34, paddingHorizontal: 13, borderRadius: 5, backgroundColor: '#d8fa53', alignItems: 'center', justifyContent: 'center' },
  matchActionText: { color: '#182019', fontSize: 10, fontWeight: '900' },
  notice: { color: '#315d4e', fontSize: 12, marginTop: 11 },
  sectionHeader: { marginTop: 29, marginBottom: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 },
  sectionKicker: { color: '#8b6d53', fontSize: 9, fontWeight: '900' },
  sectionTitle: { color: '#182019', fontSize: 18, fontFamily: 'Avenir Next', fontWeight: '700', marginTop: 3 },
  periodSwitch: { flexDirection: 'row', backgroundColor: '#e5e4dc', padding: 3, borderRadius: 6 },
  periodButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4 },
  periodButtonActive: { backgroundColor: '#fffefa' },
  periodText: { color: '#7c8178', fontSize: 10, fontWeight: '700' },
  periodTextActive: { color: '#1d2921' },
  performanceBand: { backgroundColor: '#26332b', borderRadius: 8, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 },
  performanceIntro: { flex: 1, minWidth: 150 },
  performanceName: { color: '#abb7a5', fontSize: 9, fontWeight: '800' },
  performanceSummary: { color: '#fffefa', fontFamily: 'Avenir Next', fontSize: 21, lineHeight: 28, fontWeight: '700', marginTop: 9 },
  performanceDetail: { color: '#d8fa53', fontSize: 10, marginTop: 9 },
  ringGroup: { flexDirection: 'row', justifyContent: 'space-between', gap: 18, flexGrow: 1, maxWidth: 370 },
  ringItem: { flex: 1, alignItems: 'center', gap: 7 },
  ringOuter: { width: 70, height: 70, borderRadius: 35, borderWidth: 5, alignItems: 'center', justifyContent: 'center' },
  ringArc: { position: 'absolute', width: 70, height: 70, borderRadius: 35, borderWidth: 5 },
  ringCenter: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#26332b', alignItems: 'center', justifyContent: 'center' },
  ringValue: { color: '#fffefa', fontSize: 15, fontWeight: '800' },
  ringLabel: { color: '#c5cec0', fontSize: 10, fontWeight: '700' },
  lowerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginTop: 28 },
  sectionColumn: { flex: 1, minWidth: 275 },
  sectionHeaderCompact: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 11, borderBottomWidth: 1, borderBottomColor: '#d8d8cf' },
  smallCount: { color: '#898c84', fontSize: 9, fontWeight: '800' },
  availabilityList: { paddingTop: 4 },
  availabilityRow: { flexDirection: 'row', alignItems: 'center', minHeight: 52, borderBottomWidth: 1, borderBottomColor: '#e0dfd7', gap: 10 },
  playerAvatar: { width: 29, height: 29, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  playerAvatarText: { color: '#fffefa', fontSize: 8, fontWeight: '900' },
  playerName: { color: '#283129', fontSize: 12, fontWeight: '700', flex: 1 },
  statusText: { color: '#a56633', fontSize: 10, fontWeight: '800' },
  statusAvailable: { color: '#27776f' },
  statusOut: { color: '#ad5149' },
  privacyNote: { color: '#85877e', fontSize: 10, lineHeight: 15, marginTop: 11 },
  privateLink: { color: '#315d4e', fontSize: 10, fontWeight: '800', marginTop: 10 },
  scheduleItem: { minHeight: 62, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e0dfd7', gap: 11 },
  dateTile: { width: 38, height: 42, borderRadius: 5, backgroundColor: '#f5d6c7', alignItems: 'center', justifyContent: 'center' },
  dateTileBlue: { backgroundColor: '#cce4df' },
  dateMonth: { color: '#6a6a5d', fontSize: 8, fontWeight: '800' },
  dateDay: { color: '#182019', fontSize: 16, fontWeight: '900' },
  scheduleInfo: { flex: 1 },
  scheduleTitle: { color: '#283129', fontSize: 12, fontWeight: '700' },
  scheduleMeta: { color: '#85877e', fontSize: 10, marginTop: 4 },
  scheduleChevron: { color: '#8e9287', fontSize: 13 },
  createGameButton: { alignSelf: 'flex-start', marginTop: 12, minHeight: 34, justifyContent: 'center' },
  createGameText: { color: '#315d4e', fontSize: 11, fontWeight: '800' },
  demoFootnote: { color: '#96988f', fontSize: 9, marginTop: 30, textAlign: 'center' },
});
