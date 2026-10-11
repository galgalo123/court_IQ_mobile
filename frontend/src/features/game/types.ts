export type Team = 'us' | 'opp';

export type Player = {
  id: string;
  jersey: number;
  name: string;
  position: string;
};

export type StatKind =
  | 'FG2_MADE' | 'FG2_MISS'
  | 'FG3_MADE' | 'FG3_MISS'
  | 'FT_MADE' | 'FT_MISS'
  | 'OREB' | 'DREB'
  | 'STL' | 'BLK' | 'TO' | 'FOUL';

export type GameEvent = {
  id: number;
  period: number;
  clockSeconds: number; // game clock remaining when the event happened
  team: Team;
  kind: StatKind;
  playerId: string | null; // null for opponent events
  assistId: string | null; // set on made field goals when an assist is recorded
  points: number;
};

export type GameState = {
  periodSeconds: number;
  period: number;
  clockSeconds: number;
  running: boolean;
  lastTickMs: number | null;
  roster: Player[];
  onCourt: string[];
  minutesSeconds: Record<string, number>;
  events: GameEvent[];
  nextEventId: number;
  selectedPlayerId: string | null;
  pendingAssistEventId: number | null;
};

export type GameAction =
  | { type: 'TICK'; nowMs: number }
  | { type: 'TOGGLE_CLOCK'; nowMs: number }
  | { type: 'SET_PERIOD'; period: number }
  | { type: 'SELECT_PLAYER'; playerId: string }
  | { type: 'SUB'; inId: string; outId: string | null; nowMs: number }
  | { type: 'RECORD'; kind: StatKind; team: Team; nowMs: number }
  | { type: 'ASSIGN_ASSIST'; playerId: string }
  | { type: 'SKIP_ASSIST' }
  | { type: 'UNDO' };
