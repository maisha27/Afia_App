export type { Band, ScoreResult } from "@/lib/scoring";
export type { PlanKey } from "@/lib/constants";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid";

export type Plan = "monthly" | "yearly";

export type AdminRole = "admin" | "superadmin";

export interface Profile {
  id: string;
  email: string | null;
  notification_prefs: Record<string, unknown>;
  created_at: string;
}

export interface ScreenerResult {
  id: string;
  user_id: string;
  score: number;
  band: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  plan: Plan | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface UserExerciseProgress {
  id: string;
  user_id: string;
  exercise_id: string;
  completed_date: string;
  completed_at: string;
}
