import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRole } from '@/contexts/role-context';

type Game = { opponent: string; date: string; time: string; venue: string; home: boolean };

const startingGames: Game[] = [
  { opponent: 'Northside', date: 'OCT 05', time: '6:30 PM', venue: 'Court 2', home: true },
  { opponent: 'Eastside Falcons', date: 'OCT 08', time: '7:00 PM', venue: 'Falcon Arena', home: false },
  { opponent: 'Harbor Athletics', date: 'OCT 12', time: '5:30 PM', venue: 'Court 1', home: true },
];

export default function GamesScreen() {
  const { role, isCaptain, setIsCaptain } = useRole();
  const [games, setGames] = useState(startingGames);
  const [showForm, setShowForm] = useState(false);
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [message, setMessage] = useState('');
  const canSchedule = role === 'Statistician' || (role === 'Player' && isCaptain);

  function addGame() {
    if (!opponent.trim() || !date.trim() || !time.trim()) {
      setMessage('Add an opponent, date, and time to schedule a game.');
      return;
    }
    setGames((current) => [...current, { opponent: opponent.trim(), date: date.trim().toUpperCase(), time: time.trim(), venue: venue.trim() || 'Venue to be confirmed', home: true }]);
    setOpponent('');
    setDate('');
    setTime('');
    setVenue('');
    setMessage('Game added to this preview schedule.');
    setShowForm(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>COURTIQ  /  TEAM CALENDAR</Text>
            <Text style={styles.title}>Games & schedule</Text>
            <Text style={styles.subtitle}>Fixtures, tip-off times, and where to be.</Text>
          </View>
          <Text style={styles.month}>OCT 2026</Text>
        </View>
        <View style={styles.calendarStrip}>
          {['05', '06', '07', '08', '09', '10', '11'].map((day, index) => (
            <View key={day} style={[styles.calendarDay, index === 0 && styles.calendarDayActive]}>
              <Text style={[styles.weekday, index === 0 && styles.calendarActiveText]}>{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][index]}</Text>
              <Text style={[styles.dayNumber, index === 0 && styles.calendarActiveText]}>{day}</Text>
              {index === 0 || index === 3 ? <View style={[styles.gameDot, index === 0 && styles.gameDotActive]} /> : <View style={styles.emptyDot} />}
            </View>
          ))}
        </View>
        <View style={styles.listHeader}>
          <View><Text style={styles.kicker}>UP NEXT</Text><Text style={styles.sectionTitle}>{games.length} scheduled games</Text></View>
          {canSchedule ? <Pressable accessibilityRole="button" onPress={() => { setShowForm((value) => !value); setMessage(''); }} style={styles.addButton}><Text style={styles.addButtonText}>{showForm ? 'Close' : '+  Schedule game'}</Text></Pressable> : null}
        </View>
        {role === 'Player' ? (
          <View style={styles.captainToggle}>
            <Text style={styles.captainToggleText}>Captain scheduling permission</Text>
            <Switch value={isCaptain} onValueChange={setIsCaptain} trackColor={{ false: '#c5c8be', true: '#83ad83' }} thumbColor={isCaptain ? '#234b39' : '#f8f7f2'} />
          </View>
        ) : null}
        {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
        {showForm && canSchedule ? (
          <View style={styles.form}>
            <Text style={styles.formTitle}>New fixture</Text>
            <TextInput accessibilityLabel="Opponent" placeholder="Opponent" placeholderTextColor="#8c9288" value={opponent} onChangeText={setOpponent} style={styles.input} />
            <View style={styles.formRow}>
              <TextInput accessibilityLabel="Date" placeholder="Date, e.g. OCT 19" placeholderTextColor="#8c9288" value={date} onChangeText={setDate} style={[styles.input, styles.halfInput]} />
              <TextInput accessibilityLabel="Tip-off time" placeholder="Tip-off, e.g. 6:30 PM" placeholderTextColor="#8c9288" value={time} onChangeText={setTime} style={[styles.input, styles.halfInput]} />
            </View>
            <TextInput accessibilityLabel="Venue" placeholder="Venue (optional)" placeholderTextColor="#8c9288" value={venue} onChangeText={setVenue} style={styles.input} />
            <Pressable accessibilityRole="button" onPress={addGame} style={styles.saveButton}><Text style={styles.saveButtonText}>Add to schedule</Text></Pressable>
            <Text style={styles.permissionNote}>{role === 'Statistician' ? 'Statistician access' : 'Team captain access'}  /  Preview only</Text>
          </View>
        ) : null}
        <View style={styles.gameList}>
          {games.map((game, index) => (
            <View key={`${game.opponent}-${index}`} style={styles.gameRow}>
              <View style={[styles.dateTile, index % 2 === 1 && styles.dateTileAlt]}><Text style={styles.dateText}>{game.date.split(' ')[0]}</Text><Text style={styles.dateNumber}>{game.date.split(' ')[1]}</Text></View>
              <View style={styles.gameDetails}>
                <View style={styles.gameTopLine}><Text style={styles.opponent}>{game.opponent}</Text><Text style={styles.homeAway}>{game.home ? 'HOME' : 'AWAY'}</Text></View>
                <Text style={styles.gameMeta}>{game.time}  ·  {game.venue}</Text>
              </View>
              <Text style={styles.chevron}>{'>'}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f0e8' },
  content: { width: '100%', maxWidth: 1000, alignSelf: 'center', padding: 24, paddingBottom: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, paddingVertical: 24 },
  kicker: { color: '#8b6d53', fontSize: 9, fontWeight: '900' },
  title: { color: '#182019', fontSize: 28, fontFamily: 'Avenir Next', fontWeight: '700', marginTop: 7 },
  subtitle: { color: '#6d736a', fontSize: 13, marginTop: 5 },
  month: { color: '#777c73', fontSize: 10, fontWeight: '800' },
  calendarStrip: { flexDirection: 'row', backgroundColor: '#e8e7de', borderRadius: 7, padding: 7, justifyContent: 'space-between' },
  calendarDay: { flex: 1, minHeight: 66, alignItems: 'center', justifyContent: 'center', borderRadius: 5, gap: 4 },
  calendarDayActive: { backgroundColor: '#1c2921' },
  weekday: { color: '#858980', fontSize: 8, fontWeight: '800' },
  dayNumber: { color: '#343c34', fontSize: 15, fontWeight: '800' },
  calendarActiveText: { color: '#f5f6ed' },
  gameDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#b97a58' },
  gameDotActive: { backgroundColor: '#d8fa53' },
  emptyDot: { height: 4 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, marginTop: 30, paddingBottom: 13, borderBottomWidth: 1, borderBottomColor: '#d7d8cf' },
  captainToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 },
  captainToggleText: { color: '#777c73', fontSize: 10, fontWeight: '700' },
  sectionTitle: { color: '#1b241d', fontSize: 18, fontWeight: '700', marginTop: 4 },
  addButton: { backgroundColor: '#d8fa53', borderRadius: 5, paddingHorizontal: 13, minHeight: 35, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#19221c', fontSize: 11, fontWeight: '900' },
  message: { color: '#315d4e', fontSize: 11, marginTop: 10 },
  form: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#d7d8cf', gap: 10 },
  formTitle: { color: '#1b241d', fontSize: 15, fontWeight: '800', marginBottom: 2 },
  input: { minHeight: 43, backgroundColor: '#fbfaf5', borderWidth: 1, borderColor: '#d6d8cf', borderRadius: 5, paddingHorizontal: 12, color: '#1c2921', fontSize: 12 },
  formRow: { flexDirection: 'row', gap: 9 },
  halfInput: { flex: 1 },
  saveButton: { minHeight: 42, backgroundColor: '#25332a', borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: '#f6f7ef', fontSize: 12, fontWeight: '800' },
  permissionNote: { color: '#85877e', fontSize: 9 },
  gameList: { paddingTop: 4 },
  gameRow: { flexDirection: 'row', alignItems: 'center', minHeight: 78, borderBottomWidth: 1, borderBottomColor: '#e0dfd7', gap: 12 },
  dateTile: { width: 43, height: 49, borderRadius: 5, backgroundColor: '#f5d6c7', alignItems: 'center', justifyContent: 'center' },
  dateTileAlt: { backgroundColor: '#cce4df' },
  dateText: { color: '#65685e', fontSize: 8, fontWeight: '800' },
  dateNumber: { color: '#182019', fontSize: 17, fontWeight: '900', marginTop: 2 },
  gameDetails: { flex: 1 },
  gameTopLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  opponent: { color: '#253129', fontSize: 13, fontWeight: '800' },
  homeAway: { color: '#898c84', fontSize: 8, fontWeight: '900' },
  gameMeta: { color: '#797e74', fontSize: 10, marginTop: 6 },
  chevron: { color: '#92968d', fontSize: 14 },
});