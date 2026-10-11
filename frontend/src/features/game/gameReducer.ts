import type { GameAction, GameEvent, GameState, Player, StatKind } from './types';

export const COURT_SIZE = 5;
export const DEFAULT_PERIOD_SECONDS = 600; // 10-minute quarters. Change to match league rules.

const POINTS: Partial<Record<StatKind, number>> = { FG2_MADE: 2, FG3_MADE: 3, FT_MADE: 1 };
const ASSISTABLE: StatKind[] = ['FG2_MADE', 'FG3_MADE'];

export function createGame(roster: Player[], starterIds: string[], periodSeconds = DEFAULT_PERIOD_SECONDS): GameState {
  return {
    periodSeconds,
    period: 1,
    clockSeconds: periodSeconds,
    running: false,
    lastTickMs: null,
    roster,
    onCourt: starterIds.slice(0, COURT_SIZE),
    minutesSeconds: {},
    events: [],
    nextEventId: 1,
    selectedPlayerId: null,
    pendingAssistEventId: null,
  };
}

// Counts whole seconds since the last tick using timestamps, so time spent with the
// app in the background is still counted correctly when the app comes back.
function advanceClock(state: GameState, nowMs: number): GameState {
  if (!state.running || state.lastTickMs === null) return state;
  const elapsed = Math.floor((nowMs - state.lastTickMs) / 1000);
  if (elapsed <= 0) return state;

  const seconds = Math.min(elapsed, state.clockSeconds);
  const minutesSeconds = { ...state.minutesSeconds };
  for (const id of state.onCourt) {
    minutesSeconds[id] = (minutesSeconds[id] ?? 0) + seconds;
  }
  const clockSeconds = state.clockSeconds - seconds;

  if (clockSeconds === 0) {
    return { ...state, clockSeconds, minutesSeconds, running: false, lastTickMs: null };
  }
  return { ...state, clockSeconds, minutesSeconds, lastTickMs: state.lastTickMs + elapsed * 1000 };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK':
      return advanceClock(state, action.nowMs);

    case 'TOGGLE_CLOCK': {
      if (state.running) {
        const settled = advanceClock(state, action.nowMs);
        return { ...settled, running: false, lastTickMs: null };
      }
      if (state.clockSeconds === 0) return state;
      return { ...state, running: true, lastTickMs: action.nowMs };
    }

    case 'SET_PERIOD': {
      if (state.running || action.period < 1) return state;
      return { ...state, period: action.period, clockSeconds: state.periodSeconds, lastTickMs: null };
    }

    case 'SELECT_PLAYER':
      return {
        ...state,
        selectedPlayerId: state.selectedPlayerId === action.playerId ? null : action.playerId,
      };

    case 'SUB': {
      // Minutes up to this moment belong to the old lineup, so settle the clock first.
      const s = advanceClock(state, action.nowMs);
      if (s.onCourt.includes(action.inId)) return state;

      if (action.outId !== null) {
        if (!s.onCourt.includes(action.outId)) return state;
        return {
          ...s,
          onCourt: s.onCourt.map((id) => (id === action.outId ? action.inId : id)),
          selectedPlayerId: action.outId === s.selectedPlayerId ? null : s.selectedPlayerId,
        };
      }

      if (s.onCourt.length >= COURT_SIZE) return state;
      return { ...s, onCourt: [...s.onCourt, action.inId] };
    }

    case 'RECORD': {
      const s = advanceClock(state, action.nowMs);
      const playerId = action.team === 'us' ? s.selectedPlayerId : null;
      if (action.team === 'us' && (!playerId || !s.onCourt.includes(playerId))) return state;

      const event: GameEvent = {
        id: s.nextEventId,
        period: s.period,
        clockSeconds: s.clockSeconds,
        team: action.team,
        kind: action.kind,
        playerId,
        assistId: null,
        points: POINTS[action.kind] ?? 0,
      };
      const awaitAssist = action.team === 'us' && ASSISTABLE.includes(action.kind);
      return {
        ...s,
        events: [...s.events, event],
        nextEventId: s.nextEventId + 1,
        pendingAssistEventId: awaitAssist ? event.id : null,
      };
    }

    case 'ASSIGN_ASSIST': {
      if (state.pendingAssistEventId === null) return state;
      if (action.playerId === state.selectedPlayerId || !state.onCourt.includes(action.playerId)) return state;
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === state.pendingAssistEventId ? { ...e, assistId: action.playerId } : e,
        ),
        pendingAssistEventId: null,
      };
    }

    case 'SKIP_ASSIST':
      return { ...state, pendingAssistEventId: null };

    case 'UNDO':
      if (state.events.length === 0) return state;
      return { ...state, events: state.events.slice(0, -1), pendingAssistEventId: null };

    default:
      return state;
  }
}
