import type { Player } from './types';

// Demonstration data only. Replace with the team roster from the backend.
export const DEMO_OPPONENT = 'Northside';

export const DEMO_ROSTER: Player[] = [
  { id: 'p04', jersey: 4, name: 'Maya Chen', position: 'G' },
  { id: 'p11', jersey: 11, name: 'Jalen Reed', position: 'F' },
  { id: 'p23', jersey: 23, name: 'Andre Silva', position: 'C' },
  { id: 'p02', jersey: 2, name: 'Talia King', position: 'G' },
  { id: 'p07', jersey: 7, name: 'Kevin Mwai', position: 'G' },
  { id: 'p10', jersey: 10, name: 'Brian Oduor', position: 'F' },
  { id: 'p14', jersey: 14, name: 'Lucas Kimani', position: 'F' },
  { id: 'p21', jersey: 21, name: 'Eric Njoroge', position: 'C' },
  { id: 'p05', jersey: 5, name: 'Peter Otieno', position: 'G' },
  { id: 'p33', jersey: 33, name: 'Sam Wekesa', position: 'F' },
  { id: 'p12', jersey: 12, name: 'Dan Mutiso', position: 'F' },
  { id: 'p30', jersey: 30, name: 'Ian Kiptoo', position: 'C' },
];

export const DEMO_STARTERS = ['p04', 'p11', 'p23', 'p02', 'p07'];
