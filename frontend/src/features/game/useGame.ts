import { useCallback, useEffect, useMemo, useState } from 'react';

import { createGame, gameReducer } from './gameReducer';
import type { GameAction, Player, StatKind, Team } from './types';

// Holds the live game and exposes simple actions. The clock ticks four times a second
// while running; minutes are derived from the timestamps, so the display stays exact.
export function useGame(roster: Player[], starterIds: string[]) {
  const [state, setState] = useState(() => createGame(roster, starterIds));

  const dispatch = useCallback((action: GameAction) => {
    setState((current) => gameReducer(current, action));
  }, []);

  useEffect(() => {
    if (!state.running) return;
    const id = setInterval(() => dispatch({ type: 'TICK', nowMs: Date.now() }), 250);
    return () => clearInterval(id);
  }, [state.running, dispatch]);

  const actions = useMemo(
    () => ({
      toggleClock: () => dispatch({ type: 'TOGGLE_CLOCK', nowMs: Date.now() }),
      setPeriod: (period: number) => dispatch({ type: 'SET_PERIOD', period }),
      selectPlayer: (playerId: string) => dispatch({ type: 'SELECT_PLAYER', playerId }),
      sub: (inId: string, outId: string | null) => dispatch({ type: 'SUB', inId, outId, nowMs: Date.now() }),
      record: (kind: StatKind, team: Team) => dispatch({ type: 'RECORD', kind, team, nowMs: Date.now() }),
      assignAssist: (playerId: string) => dispatch({ type: 'ASSIGN_ASSIST', playerId }),
      skipAssist: () => dispatch({ type: 'SKIP_ASSIST' }),
      undo: () => dispatch({ type: 'UNDO' }),
    }),
    [dispatch],
  );

  return { state, actions };
}
