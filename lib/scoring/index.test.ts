import { describe, it, expect } from "vitest";
import { calculateScore } from "./index";

/** Build 14 answers that sum to exactly `target` (each value 0-3). */
function answersFor(target: number): number[] {
  const answers = Array(14).fill(0);
  let remaining = target;
  for (let i = 0; i < 14 && remaining > 0; i++) {
    const v = Math.min(3, remaining);
    answers[i] = v;
    remaining -= v;
  }
  return answers;
}

describe("calculateScore — band boundaries", () => {
  it("score 0 → Low", () => {
    expect(calculateScore(Array(14).fill(0))).toMatchObject({ score: 0, band: "Low" });
  });

  it("score 14 → Low (upper boundary)", () => {
    expect(calculateScore(answersFor(14))).toMatchObject({ score: 14, band: "Low" });
  });

  it("score 15 → Mild (lower boundary)", () => {
    expect(calculateScore(answersFor(15))).toMatchObject({ score: 15, band: "Mild" });
  });

  it("score 21 → Mild (upper boundary)", () => {
    expect(calculateScore(answersFor(21))).toMatchObject({ score: 21, band: "Mild" });
  });

  it("score 22 → Moderate (lower boundary)", () => {
    expect(calculateScore(answersFor(22))).toMatchObject({ score: 22, band: "Moderate" });
  });

  it("score 27 → Moderate (upper boundary)", () => {
    expect(calculateScore(answersFor(27))).toMatchObject({ score: 27, band: "Moderate" });
  });

  it("score 28 → High (lower boundary)", () => {
    expect(calculateScore(answersFor(28))).toMatchObject({ score: 28, band: "High" });
  });

  it("score 32 → High (upper boundary)", () => {
    expect(calculateScore(answersFor(32))).toMatchObject({ score: 32, band: "High" });
  });

  it("score 33 → Very High (lower boundary)", () => {
    expect(calculateScore(answersFor(33))).toMatchObject({ score: 33, band: "Very High" });
  });

  it("score 42 → Very High (maximum)", () => {
    expect(calculateScore(Array(14).fill(3))).toMatchObject({ score: 42, band: "Very High" });
  });
});

describe("calculateScore — validation", () => {
  it("throws when fewer than 14 answers supplied", () => {
    expect(() => calculateScore([1, 2, 3])).toThrow();
  });

  it("throws when more than 14 answers supplied", () => {
    expect(() => calculateScore(Array(15).fill(0))).toThrow();
  });

  it("throws when an answer is out of range (> 3)", () => {
    expect(() => calculateScore(Array(14).fill(4))).toThrow();
  });

  it("throws when an answer is negative", () => {
    const bad = Array(14).fill(0);
    bad[0] = -1;
    expect(() => calculateScore(bad)).toThrow();
  });

  it("returns the verbatim interpretation text for each band", () => {
    const low = calculateScore(Array(14).fill(0));
    expect(low.interpretation).toContain("typical levels of health concern");

    const veryHigh = calculateScore(Array(14).fill(3));
    expect(veryHigh.interpretation).toContain("support from a qualified professional");
  });
});
