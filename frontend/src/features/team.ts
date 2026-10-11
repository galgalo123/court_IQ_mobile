import type { TeamGender } from './league';

export type Team = {
  id: string;
  name: string;
  gender: TeamGender;
  leagueId: string;
  city: string;
  homeVenue: string;
};
