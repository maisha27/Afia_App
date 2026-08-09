export const TRIAL_DAYS = 7;

export const PLANS = {
  monthly: {
    priceGbp: 12.99,
    label: "Monthly",
    interval: "month" as const,
  },
  yearly: {
    priceGbp: 69.99,
    label: "Yearly",
    interval: "year" as const,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
