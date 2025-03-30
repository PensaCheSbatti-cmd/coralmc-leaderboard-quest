
interface Player {
  name: string;
  winstreak: number;
  highest_winstreak: number;
  globalRank: number;
  livello?: number;
  kills?: number;
  deaths?: number;
  beds?: number;
  wins?: number;
  clan?: string | null;
  kdr?: string;
}
