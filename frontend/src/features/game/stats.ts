import type { GameEvent, Team } from './types';

export function teamPoints(events: GameEvent[], team: Team): number {
  return events.reduce((total, e) => (e.team === team ? total + e.points : total), 0);
}

export type PlayerLine = {
  points: number;
  fgm: number;
  fga: number;
  threeMade: number;
  threeAtt: number;
  ftm: number;
  fta: number;
  oreb: number;
  dreb: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  fouls: number;
  minutesSeconds: number;
};

// Derives a player's totals from the event log, so the numbers always match the game record.
export function playerLine(events: GameEvent[], playerId: string, minutesSeconds: Record<string, number>): PlayerLine {
  const line: PlayerLine = {
    points: 0, fgm: 0, fga: 0, threeMade: 0, threeAtt: 0, ftm: 0, fta: 0,
    oreb: 0, dreb: 0, reb: 0, ast: 0, stl: 0, blk: 0, tov: 0, fouls: 0,
    minutesSeconds: minutesSeconds[playerId] ?? 0,
  };

  for (const e of events) {
    if (e.team === 'us' && e.assistId === playerId) line.ast += 1;
    if (e.team !== 'us' || e.playerId !== playerId) continue;

    line.points += e.points;
    switch (e.kind) {
      case 'FG2_MADE': line.fgm++; line.fga++; break;
      case 'FG2_MISS': line.fga++; break;
      case 'FG3_MADE': line.fgm++; line.fga++; line.threeMade++; line.threeAtt++; break;
      case 'FG3_MISS': line.fga++; line.threeAtt++; break;
      case 'FT_MADE': line.ftm++; line.fta++; break;
      case 'FT_MISS': line.fta++; break;
      case 'OREB': line.oreb++; line.reb++; break;
      case 'DREB': line.dreb++; line.reb++; break;
      case 'STL': line.stl++; break;
      case 'BLK': line.blk++; break;
      case 'TO': line.tov++; break;
      case 'FOUL': line.fouls++; break;
    }
  }
  return line;
}
