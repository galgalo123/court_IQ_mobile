export type TeamGender = 'men' | 'women';

export type League = {
  id: string;
  name: string;
  gender: TeamGender | 'both';
  tier: string;
};

// Based on the KBF structure reported in the press. Confirm names and tiers with the federation.
export const LEAGUES: League[] = [
  { id: 'kbf-premier-men', name: 'KBF Premier League', gender: 'men', tier: 'Top tier' },
  { id: 'kbf-div1-men', name: 'KBF Division One', gender: 'men', tier: 'Second tier' },
  { id: 'kbf-div2-men', name: 'KBF Division Two', gender: 'men', tier: 'Third tier' },
  { id: 'kbf-premier-women', name: 'KBF Premier League', gender: 'women', tier: 'Top tier' },
  { id: 'kbf-div1-women', name: 'KBF Division One', gender: 'women', tier: 'Second tier' },
  { id: 'regional', name: 'Provincial or regional league', gender: 'both', tier: 'County, provincial or Nairobi Basketball Association leagues' },
  { id: 'university', name: 'University league', gender: 'both', tier: 'University teams in the Kenya University Sports Association' },
  { id: 'other', name: 'Other or not listed', gender: 'both', tier: 'Choose this if your league is not shown above' },
];

export function leaguesFor(gender: TeamGender): League[] {
  return LEAGUES.filter((league) => league.gender === gender || league.gender === 'both');
}

export function findLeague(id: string | undefined): League | undefined {
  return LEAGUES.find((league) => league.id === id);
}
