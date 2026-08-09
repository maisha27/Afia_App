export type Band = "Low" | "Mild" | "Moderate" | "High" | "Very High";

export interface ScoreResult {
  score: number;
  band: Band;
  interpretation: string;
}

const BANDS: Array<{ max: number; band: Band; interpretation: string }> = [
  {
    max: 14,
    band: "Low",
    interpretation:
      "Your responses suggest typical levels of health concern. This is within the normal range and does not indicate health anxiety.",
  },
  {
    max: 21,
    band: "Mild",
    interpretation:
      "You show some patterns of health-focused thinking. Being aware of these patterns is a positive step, and light self-help strategies may be useful.",
  },
  {
    max: 27,
    band: "Moderate",
    interpretation:
      "Your responses suggest moderate health anxiety. A structured self-help programme could help you build healthier thinking patterns around health.",
  },
  {
    max: 32,
    band: "High",
    interpretation:
      "Your responses suggest significant health anxiety. People with patterns like yours often benefit meaningfully from daily structured practice.",
  },
  {
    max: 42,
    band: "Very High",
    interpretation:
      "Your responses indicate high levels of health anxiety. We strongly recommend combining structured self-help with support from a qualified professional.",
  },
];

export function calculateScore(answers: number[]): ScoreResult {
  if (answers.length !== 14) {
    throw new Error(`Screener requires exactly 14 answers, got ${answers.length}`);
  }

  for (const a of answers) {
    if (!Number.isInteger(a) || a < 0 || a > 3) {
      throw new Error(`Each answer must be an integer between 0 and 3, got ${a}`);
    }
  }

  const score = answers.reduce((sum, a) => sum + a, 0);
  const { band, interpretation } = BANDS.find((b) => score <= b.max)!;

  return { score, band, interpretation };
}
