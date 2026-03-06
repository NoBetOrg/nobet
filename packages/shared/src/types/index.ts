// Shared TypeScript types for NoBet

export type UserRole = "user" | "admin";
export type BetStatus = "pending" | "won" | "lost" | "void";
export type MatchStatus = "upcoming" | "live" | "finished";
export type MatchResult = "home" | "draw" | "away";
export type RewardType = "prize" | "coupon";
export type RedemptionStatus = "pending" | "fulfilled" | "cancelled";
export type BetMarket = "1X2" | "ML";
export type BetSelection = "Home" | "Draw" | "Away";

export interface UserSummary {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  balance: number;
  banned: boolean;
  createdAt: Date;
}

export interface MatchSummary {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  status: MatchStatus;
  oddsHome: string;
  oddsDraw: string | null;
  oddsAway: string;
  scoreHome: number | null;
  scoreAway: number | null;
  result: MatchResult | null;
  startTime: Date;
}

export interface BetSummary {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  selection: string;
  market: string;
  odds: string;
  stake: number;
  payout: number | null;
  status: BetStatus;
  createdAt: Date;
}

export interface RewardSummary {
  id: string;
  title: string;
  description: string;
  type: RewardType;
  partnerName: string;
  imageUrl: string | null;
  costNc: number;
  stock: number;
  active: boolean;
}

export interface RedemptionSummary {
  id: string;
  rewardId: string;
  rewardTitle: string;
  partnerName: string;
  costNc: number;
  status: RedemptionStatus;
  code: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalBets: number;
  totalStaked: number;
  avoidedLoss: number;
  wonBets: number;
  lostBets: number;
  winRate: number;
  currentBalance: number;
  monthlyAvoidedLoss: MonthlyData[];
}

export interface MonthlyData {
  month: string; // "2025-01"
  label: string; // "Jan 2025"
  amount: number;
}

export interface AdminOverview {
  totalUsers: number;
  totalBets: number;
  pendingBets: number;
  totalNcInCirculation: number;
  totalRewardsRedeemed: number;
  recentUsers: UserSummary[];
}
