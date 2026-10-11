import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/palette';
import { DEMO_OPPONENT, DEMO_ROSTER, DEMO_STARTERS } from '@/features/game/demo';
import { playerLine, teamPoints } from '@/features/game/stats';
import { useGame } from '@/features/game/useGame';
import type { Player, StatKind } from '@/features/game/types';

const COURT_ACTIONS: { kind: StatKind; label: string }[] = [
  { kind: 'FG2_MADE', label: '2PT MADE' },
  { kind: 'FG2_MISS', label: '2PT MISS' },
  { kind: 'FG3_MADE', label: '3PT MADE' },
  { kind: 'FG3_MISS', label: '3PT MISS' },
  { kind: 'FT_MADE', label: 'FT MADE' },
  { kind: 'FT_MISS', label: 'FT MISS' },
  { kind: 'OREB', label: 'OFF REB' },
  { kind: 'DREB', label: 'DEF REB' },
  { kind: 'STL', label: 'STEAL' },
  { kind: 'BLK', label: 'BLOCK' },
  { kind: 'TO', label: 'TURNOVER' },
  { kind: 'FOUL', label: 'FOUL' },
];

const EVENT_TEXT: Record<StatKind, string> = {
  FG2_MADE: '2PT made',
  FG2_MISS: '2PT missed',
  FG3_MADE: '3PT made',
  FG3_MISS: '3PT missed',
  FT_MADE: 'FT made',
  FT_MISS: 'FT missed',
  OREB: 'Offensive rebound',
  DREB: 'Defensive rebound',
  STL: 'Steal',
  BLK: 'Block',
  TO: 'Turnover',
  FOUL: 'Foul',
};

function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LiveScreen() {
  const { state, actions } = useGame(DEMO_ROSTER, DEMO_STARTERS);

  const onCourt = state.roster.filter((p) => state.onCourt.includes(p.id));
  const bench = state.roster.filter((p) => !state.onCourt.includes(p.id));
  const selected = state.roster.find((p) => p.id === state.selectedPlayerId) ?? null;
  const selectedOnCourt = selected !== null && onCourt.some((p) => p.id === selected.id);
  const pending = state.pendingAssistEventId !== null;

  const names = useMemo(() => new Map(state.roster.map((p) => [p.id, p.name] as const)), [state.roster]);
  const ourPoints = teamPoints(state.events, 'us');
  const theirPoints = teamPoints(state.events, 'opp');
  const recent = [...state.events].reverse().slice(0, 6);
  const line = selected ? playerLine(state.events, selected.id, state.minutesSeconds) : null;
  const assistOptions = onCourt.filter((p) => p.id !== selected?.id);

  const subHint = selectedOnCourt
    ? `tap to sub in for #${selected?.jersey}`
    : onCourt.length < 5
      ? 'tap to bring in'
      : 'select a player on court to sub out';

  function handleBench(p: Player) {
    if (selectedOnCourt && selected) actions.sub(p.id, selected.id);
    else if (onCourt.length < 5) actions.sub(p.id, null);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.scoreCard}>
          <View style={styles.liveRow}>
            <Text style={styles.live}>● LIVE</Text>
            <Text style={styles.muted}>Period {state.period}</Text>
          </View>
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.teamLabel}>COURTIQ</Text>
              <Text style={styles.score}>{ourPoints}</Text>
            </View>
            <Text style={styles.clock}>{formatClock(state.clockSeconds)}</Text>
            <View style={styles.alignRight}>
              <Text style={styles.teamLabel}>{DEMO_OPPONENT.toUpperCase()}</Text>
              <Text style={styles.score}>{theirPoints}</Text>
            </View>
          </View>
          <View style={styles.controlRow}>
            {[1, 2, 3, 4].map((p) => (
              <Pressable
                key={p}
                disabled={state.running}
                onPress={() => actions.setPeriod(p)}
                style={[styles.periodBtn, state.period === p && styles.periodOn, state.running && styles.disabled]}
              >
                <Text style={[styles.periodText, state.period === p && styles.periodTextOn]}>Q{p}</Text>
              </Pressable>
            ))}
            <Pressable onPress={actions.toggleClock} style={[styles.clockBtn, state.running ? styles.clockPause : styles.clockStart]}>
              <Text style={[styles.clockBtnText, !state.running && styles.clockStartText]}>
                {state.running ? 'Pause' : 'Start clock'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{DEMO_OPPONENT.toUpperCase()} · SCORING</Text>
          <View style={styles.oppRow}>
            {(
              [
                ['FG2_MADE', '+2'],
                ['FG3_MADE', '+3'],
                ['FT_MADE', '+1'],
              ] as const
            ).map(([kind, label]) => (
              <Pressable key={kind} onPress={() => actions.record(kind, 'opp')} style={styles.oppBtn}>
                <Text style={styles.oppText}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ON COURT · {onCourt.length}/5 · TAP TO SELECT</Text>
          <View style={styles.chipRow}>
            {onCourt.map((p) => {
              const active = p.id === state.selectedPlayerId;
              return (
                <Pressable key={p.id} onPress={() => actions.selectPlayer(p.id)} style={[styles.chip, active && styles.chipOn]}>
                  <Text style={[styles.chipJersey, active && styles.chipTextOn]}>#{p.jersey}</Text>
                  <Text style={[styles.chipName, active && styles.chipTextOn]}>{p.name}</Text>
                  <Text style={[styles.chipMeta, active && styles.chipTextOn]}>{formatClock(state.minutesSeconds[p.id] ?? 0)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>BENCH · {subHint.toUpperCase()}</Text>
          <View style={styles.chipRow}>
            {bench.map((p) => (
              <Pressable key={p.id} onPress={() => handleBench(p)} style={styles.chip}>
                <Text style={styles.chipJersey}>#{p.jersey}</Text>
                <Text style={styles.chipName}>{p.name}</Text>
                <Text style={styles.chipMeta}>{formatClock(state.minutesSeconds[p.id] ?? 0)}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {selected && line ? (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>
              #{selected.jersey} {selected.name}
            </Text>
            <Text style={styles.panelStats}>
              {line.points} PTS · {line.reb} REB · {line.ast} AST · {line.stl} STL · {line.blk} BLK · {line.tov} TO · {line.fouls} PF · {formatClock(line.minutesSeconds)} MIN
            </Text>
            <View style={styles.grid}>
              {COURT_ACTIONS.map((a) => (
                <Pressable key={a.kind} onPress={() => actions.record(a.kind, 'us')} style={styles.actionBtn}>
                  <Text style={styles.actionText}>{a.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.hint}>Select a player on court to record stats.</Text>
        )}

        {pending ? (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Assisted by?</Text>
            <View style={styles.chipRow}>
              {assistOptions.map((p) => (
                <Pressable key={p.id} onPress={() => actions.assignAssist(p.id)} style={styles.chip}>
                  <Text style={styles.chipJersey}>#{p.jersey}</Text>
                  <Text style={styles.chipName}>{p.name}</Text>
                </Pressable>
              ))}
              <Pressable onPress={actions.skipAssist} style={styles.chip}>
                <Text style={styles.chipName}>No assist</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.recentHeader}>
          <Text style={styles.sectionLabel}>RECENT</Text>
          <Pressable onPress={actions.undo} disabled={state.events.length === 0} style={[styles.undo, state.events.length === 0 && styles.disabled]}>
            <Text style={styles.undoText}>Undo last</Text>
          </Pressable>
        </View>
        {recent.length === 0 ? <Text style={styles.hint}>No events yet.</Text> : null}
        {recent.map((e) => {
          const who = e.team === 'us' ? (names.get(e.playerId ?? '') ?? 'CourtIQ') : DEMO_OPPONENT;
          const assist = e.assistId ? ` · assist ${names.get(e.assistId) ?? ''}` : '';
          return (
            <Text key={e.id} style={styles.eventText}>
              Q{e.period} {formatClock(e.clockSeconds)} · {who} · {EVENT_TEXT[e.kind]}
              {assist}
            </Text>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 16, gap: 16 },
  muted: { color: palette.muted, fontSize: 13 },
  disabled: { opacity: 0.4 },
  scoreCard: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 16, gap: 14 },
  liveRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  live: { color: palette.error, fontSize: 13, fontWeight: '700' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  teamLabel: { color: palette.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  score: { color: palette.text, fontSize: 52, fontWeight: '700', lineHeight: 58 },
  alignRight: { alignItems: 'flex-end' },
  clock: { color: palette.text, fontSize: 30, fontWeight: '600', fontVariant: ['tabular-nums'], paddingBottom: 8 },
  controlRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  periodBtn: { borderColor: palette.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 40, justifyContent: 'center' },
  periodOn: { backgroundColor: palette.text, borderColor: palette.text },
  periodText: { color: palette.muted, fontSize: 13, fontWeight: '700' },
  periodTextOn: { color: palette.inverse },
  clockBtn: { flex: 1, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  clockStart: { backgroundColor: palette.text },
  clockPause: { backgroundColor: palette.raised, borderColor: palette.border, borderWidth: 1 },
  clockBtnText: { color: palette.text, fontSize: 14, fontWeight: '700' },
  clockStartText: { color: palette.inverse },
  section: { gap: 8 },
  sectionLabel: { color: palette.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  oppRow: { flexDirection: 'row', gap: 8 },
  oppBtn: { flex: 1, height: 52, borderRadius: 12, borderColor: palette.border, borderWidth: 1, backgroundColor: palette.surface, alignItems: 'center', justifyContent: 'center' },
  oppText: { color: palette.text, fontSize: 16, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, minWidth: 96, gap: 2 },
  chipOn: { backgroundColor: palette.text, borderColor: palette.text },
  chipJersey: { color: palette.text, fontSize: 13, fontWeight: '700' },
  chipName: { color: palette.text, fontSize: 13 },
  chipMeta: { color: palette.muted, fontSize: 11, fontVariant: ['tabular-nums'] },
  chipTextOn: { color: palette.inverse },
  panel: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 16, padding: 14, gap: 10 },
  panelTitle: { color: palette.text, fontSize: 17, fontWeight: '700' },
  panelStats: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionBtn: { flexBasis: '31%', flexGrow: 1, height: 56, borderRadius: 12, backgroundColor: palette.raised, borderColor: palette.border, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: palette.text, fontSize: 13, fontWeight: '700' },
  hint: { color: palette.muted, fontSize: 14, textAlign: 'center', paddingVertical: 8 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  undo: { borderColor: palette.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 36, justifyContent: 'center' },
  undoText: { color: palette.text, fontSize: 13, fontWeight: '600' },
  eventText: { color: palette.muted, fontSize: 13, lineHeight: 20 },
});
